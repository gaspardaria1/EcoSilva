from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.db.supabase_queries import (
    get_trees,
    get_trees_geojson,
    get_zones,
    get_zone_summary,
)

router = APIRouter(tags=["trees"])


@router.get("/trees")
async def list_trees(
    zone_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
):
    trees = await get_trees(zone_id=zone_id, status=status, limit=limit)
    return {"trees": trees, "count": len(trees)}


@router.get("/trees/geojson")
async def trees_geojson(
    zone_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
):
    return await get_trees_geojson(zone_id=zone_id, status=status)


@router.get("/zones")
async def list_zones():
    zones = await get_zones()
    return {"zones": zones}


@router.get("/zones/{zone_id}/summary")
async def zone_summary(zone_id: str):
    summary = await get_zone_summary(zone_id)

    if not summary:
        raise HTTPException(status_code=404, detail="Zone not found")

    return summary