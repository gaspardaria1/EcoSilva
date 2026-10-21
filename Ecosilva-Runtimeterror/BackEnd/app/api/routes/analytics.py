import asyncio
from datetime import datetime
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from google import genai

from app.config import settings
from app.db.supabase_queries import (
    get_anomalies,
    get_illegal_logging_report,
    get_trends,
    get_zones,
    get_trees,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/anomalies")
async def list_anomalies(
    zone_id: Optional[str] = Query(None),
    resolved: bool = Query(False),
    limit: int = Query(100, le=500),
):
    anomalies = await get_anomalies(zone_id=zone_id, resolved=resolved, limit=limit)
    return {"anomalies": anomalies, "count": len(anomalies)}


@router.get("/trends")
async def trends(zone_id: Optional[str] = Query(None)):
    data = await get_trends(zone_id=zone_id)
    return {"trends": data}


@router.get("/reports/illegal-logging")
async def illegal_logging_report(
    zone_id: Optional[str] = Query(None),
    days_back: int = Query(90),
):
    report = await get_illegal_logging_report(zone_id=zone_id, days_back=days_back)
    return {
        "report": report,
        "period_days": days_back,
        "generated_at": datetime.utcnow().isoformat(),
    }


@router.get("/summary")
async def summary():
    zones, trees, anomalies = await asyncio.gather(
        get_zones(),
        get_trees(limit=1000),
        get_anomalies(limit=500),
    )

    total_trees = len(trees)
    cut_trees = len([t for t in trees if t.get("status") == "cut"])
    anomaly_trees = len([t for t in trees if t.get("status") == "anomaly"])
    active_trees = len([t for t in trees if t.get("status") == "active"])

    illegal_cut_ids = {
        a.get("tree_id")
        for a in anomalies
        if a.get("type") == "illegal_cut"
    }
    illegal_cuts = len([t for t in trees if t.get("id") in illegal_cut_ids])

    return {
        "zones_count": len(zones),
        "trees_total": total_trees,
        "trees_active": active_trees,
        "trees_cut": cut_trees,
        "trees_anomaly": anomaly_trees,
        "illegal_cuts": illegal_cuts,
        "anomalies_open": len(anomalies),
        "zones": zones,
    }


class GenerateReportRequest(BaseModel):
    type: str
    zone_id: Optional[str] = None
    zone_name: Optional[str] = "Toate unitățile"
    period_from: Optional[str] = None
    period_to: Optional[str] = None


@router.post("/generate-report")
async def generate_report(request: GenerateReportRequest):
    zones, trees, anomalies, illegal_report = await asyncio.gather(
        get_zones(),
        get_trees(zone_id=request.zone_id, limit=500),
        get_anomalies(zone_id=request.zone_id, limit=200),
        get_illegal_logging_report(zone_id=request.zone_id, days_back=90),
    )

    zone_info = next((z for z in zones if z.get("id") == request.zone_id), None)

    species_counter: dict = {}
    for t in trees:
        sp = t.get("species") or "Necunoscut"
        species_counter[sp] = species_counter.get(sp, 0) + 1

    cut_trees = [t for t in trees if t.get("status") == "cut"]
    illegal_ids = {a.get("tree_id") for a in anomalies if a.get("type") == "illegal_cut"}
    illegal_count = len([t for t in cut_trees if t.get("id") in illegal_ids])

    context_lines = [
        f"Tip raport: {request.type}",
        f"Unitate producție: {request.zone_name}",
        f"Perioadă: {request.period_from or 'n/a'} — {request.period_to or 'n/a'}",
        "",
        "DATE ARBORI:",
        f"- Total arbori monitorizați: {len(trees)}",
        f"- Arbori activi: {len([t for t in trees if t.get('status') == 'active'])}",
        f"- Arbori tăiați: {len(cut_trees)}",
        f"  din care ilegali: {illegal_count}",
        f"- Arbori cu anomalii: {len([t for t in trees if t.get('status') == 'anomaly'])}",
        "",
        "SPECII (top 5):",
    ]
    for sp, cnt in sorted(species_counter.items(), key=lambda x: -x[1])[:5]:
        context_lines.append(f"  {sp}: {cnt} arbori")

    if zone_info:
        context_lines += [
            "",
            "DATE ZONĂ:",
            f"  Suprafață: {zone_info.get('area', 0)} ha",
            f"  Specie dominantă: {zone_info.get('dominant', '-')}",
        ]

    context_lines += [
        "",
        "ALERTE DESCHISE:",
    ]
    for a in anomalies[:10]:
        context_lines.append(
            f"  - {a.get('type')} | {a.get('severity')} | {a.get('zone_name')} | {a.get('description', '')}"
        )

    context_lines += [
        "",
        "RAPORT TĂIERI ILEGALE (90 zile):",
    ]
    for row in illegal_report[:5]:
        context_lines.append(
            f"  - {row['zone']}: {row['total_cuts']} tăieri totale, "
            f"{row['night_cuts']} nocturne, {row['premature_cuts']} premature"
        )

    data_context = "\n".join(context_lines)

    prompt = f"""Ești asistent AI pentru EcoSilva, sistem de monitorizare silvică.
Generează un raport silvic profesional de tip "{request.type}" în română.

{data_context}

Raportul trebuie să conțină:
1. **Rezumat executiv** — situația generală în 3-4 propoziții
2. **Statistici cheie** — tabel cu datele principale
3. **Analiza tăierilor** — legal vs ilegal, tendințe
4. **Alerte active** — descriere scurtă și nivel de risc
5. **Recomandări** — 3-5 acțiuni concrete pentru echipa de teren
6. **Concluzie**

Fii concis, profesional, bazat STRICT pe datele de mai sus."""

    client = genai.Client(api_key=settings.gemini_api_key)
    response = await asyncio.to_thread(
        client.models.generate_content,
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "report_text": response.text,
        "type": request.type,
        "zone_name": request.zone_name,
        "trees_count": len(trees),
        "illegal_cuts": illegal_count,
        "anomalies_count": len(anomalies),
        "generated_at": datetime.utcnow().isoformat(),
    }
