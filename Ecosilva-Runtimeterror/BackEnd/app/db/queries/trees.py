# app/db/queries/trees.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional
import json


async def get_trees(
    db: AsyncSession,
    zone_id: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 100,
) -> list:
    conditions = []
    params = {"limit": limit}

    if zone_id:
        conditions.append("zone_id = :zone_id")
        params["zone_id"] = zone_id
    if status:
        conditions.append("status = :status")
        params["status"] = status

    where = "WHERE " + " AND ".join(conditions) if conditions else ""

    query = text(f"""
        SELECT 
            t.id, t.chip_id, t.zone_id, t.species,
            t.planting_date, t.cut_date, t.status,
            t.last_signal_at, t.created_at,
            ST_AsGeoJSON(t.location)::json as location,
            z.name as zone_name
        FROM trees t
        LEFT JOIN zones z ON z.id = t.zone_id
        {where}
        ORDER BY t.created_at DESC
        LIMIT :limit
    """)

    result = await db.execute(query, params)
    rows = result.mappings().all()
    return [dict(row) for row in rows]


async def get_trees_geojson(
    db: AsyncSession,
    zone_id: Optional[str] = None,
) -> dict:
    params = {}
    where = ""
    if zone_id:
        where = "WHERE t.zone_id = :zone_id"
        params["zone_id"] = zone_id

    query = text(f"""
        SELECT json_build_object(
            'type', 'FeatureCollection',
            'features', COALESCE(json_agg(
                json_build_object(
                    'type', 'Feature',
                    'geometry', ST_AsGeoJSON(t.location)::json,
                    'properties', json_build_object(
                        'id', t.id,
                        'chip_id', t.chip_id,
                        'status', t.status,
                        'species', t.species,
                        'zone_name', z.name
                    )
                )
            ), '[]'::json)
        ) as geojson
        FROM trees t
        LEFT JOIN zones z ON z.id = t.zone_id
        {where}
    """)

    result = await db.execute(query, params)
    row = result.mappings().first()
    return row["geojson"] if row else {"type": "FeatureCollection", "features": []}


async def execute_tree_query(db: AsyncSession, nl_query: str) -> str:
    """
    Simple keyword-based query dispatcher.
    The LLM agent calls this with a natural language question;
    we map it to a safe SQL query.
    In a production system you'd use Gemini to generate SQL with validation.
    """
    nl_lower = nl_query.lower()

    # Cut trees
    if "cut" in nl_lower or "illegal" in nl_lower or "logging" in nl_lower:
        query = text("""
            SELECT t.chip_id, t.species, t.planting_date, t.cut_date,
                   z.name as zone, t.status,
                   EXTRACT(YEAR FROM AGE(t.cut_date, t.planting_date)) as years_before_cut
            FROM trees t
            LEFT JOIN zones z ON z.id = t.zone_id
            WHERE t.status = 'cut'
            ORDER BY t.cut_date DESC
            LIMIT 50
        """)

    # Anomalies
    elif "anomaly" in nl_lower or "anomalies" in nl_lower or "suspicious" in nl_lower:
        query = text("""
            SELECT a.anomaly_type, a.severity, a.detected_at, a.description,
                   t.chip_id, z.name as zone
            FROM anomalies a
            LEFT JOIN trees t ON t.id = a.tree_id
            LEFT JOIN zones z ON z.id = a.zone_id
            WHERE a.resolved = false
            ORDER BY a.detected_at DESC
            LIMIT 50
        """)

    # Count/summary
    elif "count" in nl_lower or "how many" in nl_lower or "total" in nl_lower:
        query = text("""
            SELECT 
                z.name as zone,
                COUNT(*) FILTER (WHERE t.status = 'active') as active,
                COUNT(*) FILTER (WHERE t.status = 'cut') as cut,
                COUNT(*) FILTER (WHERE t.status = 'anomaly') as anomaly,
                COUNT(*) as total
            FROM trees t
            LEFT JOIN zones z ON z.id = t.zone_id
            GROUP BY z.name
            ORDER BY z.name
        """)

    # Default: general summary
    else:
        query = text("""
            SELECT status, COUNT(*) as count
            FROM trees
            GROUP BY status
        """)

    result = await db.execute(query)
    rows = result.mappings().all()
    return json.dumps([dict(r) for r in rows], default=str)
