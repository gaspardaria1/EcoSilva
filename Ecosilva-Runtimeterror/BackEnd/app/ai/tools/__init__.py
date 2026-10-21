# app/ai/tools/__init__.py
from app.ai.tools.query_trees import query_trees_tool
from app.ai.tools.generate_chart import generate_chart_tool
from app.ai.tools.generate_map import generate_map_tool
from app.ai.tools.detect_anomalies import detect_anomalies_tool
from app.ai.tools.prompt_coach import prompt_coach_tool

__all__ = [
    "query_trees_tool",
    "generate_chart_tool",
    "generate_map_tool",
    "detect_anomalies_tool",
    "prompt_coach_tool",
]
