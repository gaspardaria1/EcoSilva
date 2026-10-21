# seed/seed_data.py
"""
Run with: python -m seed.seed_data
Make sure your .env is set up first.
"""
import asyncio
import random
from datetime import datetime, timedelta, date
from app.db.session import AsyncSessionLocal
from sqlalchemy import text
import uuid

ZONES = [
    ("Zone Norte", "ZN01"),
    ("Zone Sul", "ZS01"),
    ("Zone Leste", "ZL01"),
    ("Zone Oeste", "ZO01"),
    ("Zone Central", "ZC01"),
]

SPECIES = ["Eucalyptus", "Pine", "Oak", "Mahogany", "Cedar", "Teak"]

# Bounding box: Amazon-ish coordinates
LAT_RANGE = (-3.0, -1.0)
LON_RANGE = (-60.0, -58.0)


async def seed():
    async with AsyncSessionLocal() as db:
        print("Seeding zones...")
        zone_ids = []
        for name, code in ZONES:
            zone_id = str(uuid.uuid4())
            zone_ids.append(zone_id)
            await db.execute(
                text("""
                    INSERT INTO zones (id, name, code)
                    VALUES (:id, :name, :code)
                    ON CONFLICT (code) DO NOTHING
                """),
                {"id": zone_id, "name": name, "code": code},
            )
        await db.commit()

        # Re-fetch zone IDs (in case of conflict skip)
        result = await db.execute(text("SELECT id FROM zones ORDER BY created_at"))
        zone_ids = [str(r[0]) for r in result.fetchall()]

        print("Seeding 1000 trees...")
        trees_data = []
        for i in range(1000):
            zone_id = random.choice(zone_ids)
            lat = random.uniform(*LAT_RANGE)
            lon = random.uniform(*LON_RANGE)
            planting_date = date.today() - timedelta(days=random.randint(365, 3650))

            # 20% cut trees
            if random.random() < 0.2:
                status = "cut"
                # Some premature (< 5 years = 1825 days)
                if random.random() < 0.4:
                    days_after_planting = random.randint(180, 1500)  # premature
                else:
                    days_after_planting = random.randint(1826, 3000)
                cut_date = (
                    datetime.combine(planting_date, datetime.min.time())
                    + timedelta(days=days_after_planting)
                )
                # Some night cuts
                if random.random() < 0.3:
                    cut_date = cut_date.replace(hour=random.choice([22, 23, 0, 1, 2, 3]))
            elif random.random() < 0.05:
                status = "anomaly"
                cut_date = None
            elif random.random() < 0.03:
                status = "missing"
                cut_date = None
            else:
                status = "active"
                cut_date = None

            trees_data.append({
                "id": str(uuid.uuid4()),
                "chip_id": f"CHIP-{i:05d}",
                "zone_id": zone_id,
                "lat": lat,
                "lon": lon,
                "species": random.choice(SPECIES),
                "planting_date": planting_date,
                "cut_date": cut_date,
                "status": status,
                "last_signal_at": datetime.now() - timedelta(hours=random.randint(0, 72)),
            })

        for t in trees_data:
            await db.execute(
                text("""
                    INSERT INTO trees (
                        id, chip_id, zone_id, location, species,
                        planting_date, cut_date, status, last_signal_at
                    ) VALUES (
                        :id, :chip_id, :zone_id,
                        ST_GeogFromText('SRID=4326;POINT(' || :lon || ' ' || :lat || ')'),
                        :species, :planting_date, :cut_date, :status, :last_signal_at
                    )
                    ON CONFLICT (chip_id) DO NOTHING
                """),
                t,
            )
        await db.commit()

        print("Seeding anomalies...")
        result = await db.execute(
            text("SELECT id, zone_id FROM trees WHERE status IN ('cut', 'anomaly') LIMIT 50")
        )
        flagged = result.fetchall()

        anomaly_types = [
            ("premature_cut", "high", "Tree cut before reaching 5-year harvest age"),
            ("cluster_cut", "high", "Part of a cluster of 5+ trees cut within 7 days"),
            ("night_activity", "medium", "Cut event detected between 22:00 and 05:00"),
            ("signal_loss", "medium", "Chip signal lost for over 48 hours"),
        ]

        for tree_id, zone_id in flagged[:30]:
            atype, severity, desc = random.choice(anomaly_types)
            await db.execute(
                text("""
                    INSERT INTO anomalies (id, tree_id, zone_id, anomaly_type, severity, description)
                    VALUES (:id, :tree_id, :zone_id, :type, :severity, :desc)
                """),
                {
                    "id": str(uuid.uuid4()),
                    "tree_id": str(tree_id),
                    "zone_id": str(zone_id),
                    "type": atype,
                    "severity": severity,
                    "desc": desc,
                },
            )
        await db.commit()
        print("✅ Seed complete — 5 zones, 1000 trees, anomalies inserted.")


if __name__ == "__main__":
    asyncio.run(seed())
