# app/ai/tools/prompt_coach.py
import re
from langchain_core.tools import tool


@tool
def prompt_coach_tool(original_prompt: str, user_level: str = "L0") -> dict:
    """
    Analyze a user's prompt and give coaching tips to improve it.
    Call this after answering to help the user write better queries.

    Args:
        original_prompt: The user's original question.
        user_level: Current skill level — 'L0' (beginner) or 'L1' (proficient).

    Returns:
        A dict with score (0-100), level, suggestions list, and an improved_prompt example.
    """
    score = 0
    suggestions = []
    prompt_lower = original_prompt.lower()

    # Zone specificity
    if re.search(r'\b(zone|zona|region|area|norte|sul|leste|oeste)\b', prompt_lower):
        score += 25
    else:
        suggestions.append("Add a zone filter, e.g., 'in Zone Norte'")

    # Time range
    if re.search(
        r'\b(last|past|from|since|between|ago|days?|weeks?|months?|years?|'
        r'dias?|semanas?|meses?|anos?)\b',
        prompt_lower,
    ) or re.search(r'\d{4}[-/]\d{2}[-/]\d{2}', prompt_lower):
        score += 25
    else:
        suggestions.append("Specify a time range, e.g., 'in the last 30 days'")

    # Specific metric
    if re.search(
        r'\b(count|total|average|trend|rate|percentage|how many|'
        r'quantos|média|taxa|número)\b',
        prompt_lower,
    ):
        score += 25
    else:
        suggestions.append("Ask for a specific metric: 'count', 'trend', 'percentage'")

    # Output format
    if re.search(
        r'\b(chart|graph|map|table|list|report|gráfico|mapa|tabela|relatório)\b',
        prompt_lower,
    ):
        score += 25
    else:
        suggestions.append("Request a format: 'as a chart', 'on a map', 'as a table'")

    # Build improved prompt
    improved = original_prompt.strip()
    if suggestions:
        if any("zone" in s.lower() for s in suggestions):
            improved += " in Zone Norte"
        if any("time" in s.lower() for s in suggestions):
            improved += " in the last 30 days"
        if any("metric" in s.lower() for s in suggestions):
            improved = "Show the count of " + improved.lower().replace("show me ", "")
        if any("format" in s.lower() for s in suggestions):
            improved += " as a chart"

    return {
        "score": score,
        "level": "L1" if score >= 75 else "L0",
        "suggestions": suggestions,
        "improved_prompt": improved.strip(),
    }
