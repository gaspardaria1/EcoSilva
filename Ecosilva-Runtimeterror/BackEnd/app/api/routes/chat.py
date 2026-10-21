import asyncio
import time
from collections import Counter
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from google import genai

from app.config import settings
from app.db.supabase_queries import get_anomalies, get_trees, get_zones

router = APIRouter(prefix="/chat", tags=["chat"])

_cache: dict = {}
_CACHE_TTL = 300  # 5 minutes


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


def age_group(age):
    if age is None:
        return "Necunoscut"
    if age < 30:
        return "Sub 30 ani"
    if age < 50:
        return "30-49 ani"
    if age < 70:
        return "50-69 ani"
    return "70+ ani"


def build_charts(trees, anomalies):
    species_counter = Counter(t.get("species") or "Necunoscut" for t in trees)
    age_counter = Counter(age_group(t.get("age_years")) for t in trees)

    illegal_cut_ids = {
        a.get("tree_id")
        for a in anomalies
        if a.get("type") == "illegal_cut"
    }

    total_cut = len([t for t in trees if t.get("status") == "cut"])
    illegally_cut = len([t for t in trees if t.get("id") in illegal_cut_ids])
    legally_cut = max(total_cut - illegally_cut, 0)

    return {
        "species": [
            {"label": key, "value": value}
            for key, value in species_counter.items()
        ],
        "age": [
            {"label": key, "value": value}
            for key, value in age_counter.items()
        ],
        "cuts": [
            {"label": "Tăieri legale", "value": legally_cut},
            {"label": "Tăieri ilegale", "value": illegally_cut},
        ],
    }


def build_data_context(zones, trees, anomalies):
    lines = []
    lines.append("DATE DIN SUPABASE — ECOSILVA")
    lines.append("")

    lines.append("Zone / unități de producție:")
    for zone in zones:
        lines.append(
            f"- {zone.get('name')} | cod: {zone.get('code')} | "
            f"suprafață: {zone.get('area', 0)} ha | "
            f"specie dominantă: {zone.get('dominant', '-')} | "
            f"arbori: {zone.get('tree_count', 0)} | "
            f"tăieri: {zone.get('cut_count', 0)} | "
            f"anomalii: {zone.get('anomaly_count', 0)}"
        )

    lines.append("")
    lines.append("Arbori monitorizați (eșantion):")
    for tree in trees:
        lines.append(
            f"- {tree.get('chip_id')} | zonă: {tree.get('zone_name') or tree.get('zone_id')} | "
            f"specie: {tree.get('species')} | vârstă: {tree.get('age_years')} ani | "
            f"status: {tree.get('status')}"
        )

    lines.append("")
    lines.append("Alerte / anomalii:")
    for anomaly in anomalies:
        lines.append(
            f"- {anomaly.get('type')} | severitate: {anomaly.get('severity')} | "
            f"zonă: {anomaly.get('zone_name') or anomaly.get('zone_id')} | "
            f"descriere: {anomaly.get('description')}"
        )

    return "\n".join(lines)


def build_coaching(prompt):
    return {
        "understood": "o cerere de analiză silvică pe baza datelor din Supabase",
        "missing": [],
        "chips": ["+ distribuție pe specii", "+ distribuție pe vârstă", "+ tăieri legale vs ilegale"],
        "level": "Raport generat cu Gemini",
        "score": 4,
    }


async def _get_db_data():
    now = time.monotonic()
    cached = _cache.get("data")
    if cached and now - _cache.get("ts", 0) < _CACHE_TTL:
        return cached

    zones, trees, anomalies = await asyncio.gather(
        get_zones(),
        get_trees(limit=100),
        get_anomalies(limit=100),
    )
    result = (zones, trees, anomalies)
    _cache["data"] = result
    _cache["ts"] = now
    return result


@router.post("/message")
async def send_message(request: ChatRequest):
    if not settings.gemini_api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY lipsește din .env",
        )

    try:
        zones, trees, anomalies = await _get_db_data()

        charts = build_charts(trees, anomalies)
        data_context = build_data_context(zones, trees, anomalies)

        prompt = f"""Ești Silviq, asistent AI pentru ingineri silvici în aplicația EcoSilva.
Răspunde în română, concis și profesional. Folosește STRICT datele de mai jos.
Nu inventa valori. Dacă lipsesc date, spune-o direct.

Întrebarea: {request.message}

{data_context}

Răspunde cu: rezumat, observații importante, interpretarea alertelor, recomandări."""

        client = genai.Client(api_key=settings.gemini_api_key)
        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash",
            contents=prompt,
        )
        answer = response.text

        return {
            "answer": answer,
            "charts": charts,
            "coaching": build_coaching(request.message),
        }

    except Exception as error:
        print(f"--- EROARE BACKEND ECO SILVA ---")
        print(f"Tip eroare: {type(error).__name__}")
        print(f"Mesaj: {str(error)}")
        raise HTTPException(
            status_code=500,
            detail=f"Eroare la procesarea cererii: {str(error)}",
        )
