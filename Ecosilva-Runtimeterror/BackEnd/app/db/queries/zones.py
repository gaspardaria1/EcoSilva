# app/db/queries/zones.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


async def get_zones(db: AsyncSession) -> list:
    query = text("""
        SELECT 
            z.id, z.name, z.code,
            COUNT(t.id) as tree_count,
            COUNT(t.id) FILTER (WHERE t.status = 'cut') as cut_count,
            COUNT(t.id) FILTER (WHERE t.status = 'anomaly') as anomaly_count
        FROM zones z
        LEFT JOIN trees t ON t.zone_id = z.id
        GROUP BY z.id, z.name, z.code
        ORDER BY z.name
    """)
    result = await db.execute(query)
    return [dict(row) for row in result.mappings().all()]


async def get_zone_summary(db: AsyncSession, zone_id: str) -> dict:
    query = text("""
        SELECT 
            z.id, z.name, z.code,
            COUNT(t.id) as tree_count,
            COUNT(t.id) FILTER (WHERE t.status = 'active') as active_count,
            COUNT(t.id) FILTER (WHERE t.status = 'cut') as cut_count,
            COUNT(t.id) FILTER (WHERE t.status = 'anomaly') as anomaly_count,
            COUNT(t.id) FILTER (WHERE t.status = 'missing') as missing_count
        FROM zones z
        LEFT JOIN trees t ON t.zone_id = z.id
        WHERE z.id = :zone_id
        GROUP BY z.id, z.name, z.code
    """)
    result = await db.execute(query, {"zone_id": zone_id})
    row = result.mappings().first()
    return dict(row) if row else {}
