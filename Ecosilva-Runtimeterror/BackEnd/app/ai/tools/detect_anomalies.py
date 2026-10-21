# app/ai/tools/detect_anomalies.py
from langchain_core.tools import tool
import json


@tool
def detect_anomalies_tool(zone_id: str = "", days_back: int = 90) -> str:
    """
    Detect potential illegal logging anomalies using rule-based heuristics.
    Use this when the user asks about suspicious activity, illegal logging,
    or anomalies in the forest.

    Args:
        zone_id: Optional zone ID to filter. Leave empty for all zones.
        days_back: How many days back to look. Default 90.

    Returns:
        JSON string describing detected anomalies and their explanations.
    """
    # These rules mirror the SQL heuristics.
    # In the real endpoint, this calls the DB — here we return the rule descriptions
    # so the LLM can explain them. The /analytics/anomalies endpoint does the real query.
    heuristics = [
        {
            "type": "premature_cut",
            "description": "Trees cut before reaching minimum harvest age (5 years).",
            "severity": "high",
            "sql_hint": "WHERE cut_date - planting_date < INTERVAL '5 years'",
        },
        {
            "type": "cluster_cut",
            "description": "5+ trees cut within 500m radius within a 7-day window.",
            "severity": "high",
            "sql_hint": "Spatial clustering with ST_DWithin + time window",
        },
        {
            "type": "night_activity",
            "description": "Cut events logged between 22:00 and 05:00 local time.",
            "severity": "medium",
            "sql_hint": "EXTRACT(HOUR FROM cut_date) BETWEEN 22 AND 5",
        },
        {
            "type": "signal_loss",
            "description": "Chip stopped reporting for more than 48 hours unexpectedly.",
            "severity": "medium",
            "sql_hint": "last_signal_at < NOW() - INTERVAL '48 hours' AND status = 'active'",
        },
        {
            "type": "zone_mismatch",
            "description": "Tree coordinates fall outside the registered zone boundary.",
            "severity": "high",
            "sql_hint": "NOT ST_Within(location, zone.boundary)",
        },
    ]

    return json.dumps({
        "zone_filter": zone_id or "all zones",
        "period_days": days_back,
        "heuristics_applied": heuristics,
        "note": (
            "Use GET /analytics/anomalies for real-time counts. "
            "These heuristics explain how anomalies are detected."
        ),
    })
