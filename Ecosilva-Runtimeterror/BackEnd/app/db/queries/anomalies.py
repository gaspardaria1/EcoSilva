# app/db/queries/anomalies.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional


async def get_anomalies(
    db: AsyncSession,
    zone_id: Optional[str] = None,
    resolved: bool = False,
    limit: int = 100,
) -> list:
    params = {"resolved": resolved, "limit": limit}
    zone_filter = ""
    if zone_id:
        zone_filter = "AND a.zone_id = :zone_id"
        params["zone_id"] = zone_id

    query = text(f"""
        SELECT 
            a.id, a.anomaly_type, a.severity, a.detected_at,
            a.description, a.resolved,
            t.chip_id, z.name as zone_name
        FROM anomalies a
        LEFT JOIN trees t ON t.id = a.tree_id
        LEFT JOIN zones z ON z.id = a.zone_id
        WHERE a.resolved = :resolved
        {zone_filter}
        ORDER BY a.detected_at DESC
        LIMIT :limit
    """)

    result = await db.execute(query, params)
    return [dict(row) for row in result.mappings().all()]
