from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException

from app.db.session import supabase


def check_supabase():
    if supabase is None:
        raise HTTPException(
            status_code=500,
            detail="Supabase is not configured. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env.",
        )


def get_response_data(response):
    return response.data if response and response.data is not None else []


async def get_zones():
    check_supabase()

    response = (
        supabase.table("zones")
        .select("*")
        .order("name")
        .execute()
    )

    zones = get_response_data(response)

    tree_response = (
        supabase.table("trees")
        .select("id, zone_id, status")
        .execute()
    )

    trees = get_response_data(tree_response)

    result = []

    for zone in zones:
        zone_trees = [tree for tree in trees if tree.get("zone_id") == zone.get("id")]

        result.append({
            **zone,
            "tree_count": len(zone_trees),
            "cut_count": len([tree for tree in zone_trees if tree.get("status") == "cut"]),
            "anomaly_count": len([tree for tree in zone_trees if tree.get("status") == "anomaly"]),
        })

    return result


async def get_zone_summary(zone_id: str):
    check_supabase()

    zone_response = (
        supabase.table("zones")
        .select("*")
        .eq("id", zone_id)
        .limit(1)
        .execute()
    )

    zones = get_response_data(zone_response)

    if not zones:
        return {}

    zone = zones[0]

    tree_response = (
        supabase.table("trees")
        .select("id, status")
        .eq("zone_id", zone_id)
        .execute()
    )

    trees = get_response_data(tree_response)

    return {
        **zone,
        "tree_count": len(trees),
        "active_count": len([tree for tree in trees if tree.get("status") == "active"]),
        "cut_count": len([tree for tree in trees if tree.get("status") == "cut"]),
        "anomaly_count": len([tree for tree in trees if tree.get("status") == "anomaly"]),
        "missing_count": len([tree for tree in trees if tree.get("status") == "missing"]),
    }


async def get_trees(
    zone_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100,
):
    check_supabase()

    query = (
        supabase.table("trees")
        .select("*, zones(name, code)")
        .order("created_at", desc=True)
        .limit(limit)
    )

    if zone_id:
        query = query.eq("zone_id", zone_id)

    if status:
        query = query.eq("status", status)

    response = query.execute()
    trees = get_response_data(response)

    for tree in trees:
        zone = tree.get("zones") or {}
        tree["zone_name"] = zone.get("name")

    return trees


async def get_trees_geojson(
    zone_id: Optional[str] = None,
    status: Optional[str] = None,
):
    trees = await get_trees(zone_id=zone_id, status=status, limit=500)

    features = []

    for tree in trees:
        lat = tree.get("lat")
        lon = tree.get("lon")

        if lat is None or lon is None:
            continue

        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat],
            },
            "properties": {
                "id": tree.get("id"),
                "chip_id": tree.get("chip_id"),
                "status": tree.get("status"),
                "species": tree.get("species"),
                "zone_id": tree.get("zone_id"),
                "zone_name": tree.get("zone_name"),
            },
        })

    return {
        "type": "FeatureCollection",
        "features": features,
    }


async def get_anomalies(
    zone_id: Optional[str] = None,
    resolved: bool = False,
    limit: int = 100,
):
    check_supabase()

    query = (
        supabase.table("anomalies")
        .select("*, trees(chip_id), zones(name)")
        .eq("resolved", resolved)
        .order("detected_at", desc=True)
        .limit(limit)
    )

    if zone_id:
        query = query.eq("zone_id", zone_id)

    response = query.execute()
    anomalies = get_response_data(response)

    for anomaly in anomalies:
        tree = anomaly.get("trees") or {}
        zone = anomaly.get("zones") or {}

        anomaly["chip_id"] = tree.get("chip_id")
        anomaly["zone_name"] = zone.get("name")

    return anomalies


async def get_trends(zone_id: Optional[str] = None):
    trees = await get_trees(zone_id=zone_id, status="cut", limit=1000)

    grouped = defaultdict(int)

    for tree in trees:
        cut_date = tree.get("cut_date")

        if not cut_date:
            continue

        month = cut_date[:7]
        zone_name = tree.get("zone_name") or tree.get("zone_id") or "Unknown"

        grouped[(month, zone_name)] += 1

    trends = []

    for (month, zone_name), count in grouped.items():
        trends.append({
            "month": month,
            "zone_name": zone_name,
            "cut_count": count,
        })

    return sorted(trends, key=lambda row: row["month"], reverse=True)


async def get_illegal_logging_report(
    zone_id: Optional[str] = None,
    days_back: int = 90,
):
    trees = await get_trees(zone_id=zone_id, status="cut", limit=1000)

    now = datetime.utcnow()
    start_date = now - timedelta(days=days_back)

    grouped = defaultdict(lambda: {
        "premature_cuts": 0,
        "night_cuts": 0,
        "total_cuts": 0,
    })

    for tree in trees:
        cut_date_raw = tree.get("cut_date")
        planting_date_raw = tree.get("planting_date")

        if not cut_date_raw:
            continue

        try:
            cut_date = datetime.fromisoformat(cut_date_raw.replace("Z", "+00:00")).replace(tzinfo=None)
        except ValueError:
            continue

        if cut_date < start_date:
            continue

        zone_name = tree.get("zone_name") or tree.get("zone_id") or "Unknown"
        grouped[zone_name]["total_cuts"] += 1

        if cut_date.hour >= 22 or cut_date.hour <= 5:
            grouped[zone_name]["night_cuts"] += 1

        if planting_date_raw:
            try:
                planting_date = datetime.fromisoformat(planting_date_raw[:10])
                tree_age_years = (cut_date - planting_date).days / 365
                if tree_age_years < 5:
                    grouped[zone_name]["premature_cuts"] += 1
            except ValueError:
                pass

    report = []

    for zone_name, values in grouped.items():
        report.append({
            "zone": zone_name,
            **values,
        })

    return sorted(report, key=lambda row: row["total_cuts"], reverse=True)