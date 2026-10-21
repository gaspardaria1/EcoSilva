# app/ai/tools/generate_chart.py
from langchain_core.tools import tool
import json


@tool
def generate_chart_tool(
    chart_type: str,
    title: str,
    description: str,
) -> str:
    """
    Generate a Vega-Lite chart specification for the frontend to render.
    Use this when the user asks for a chart, graph, or visualization of data.

    Args:
        chart_type: One of 'bar', 'line', 'pie', 'scatter'.
        title: Chart title.
        description: What the chart should show (the frontend fetches real data).

    Returns:
        A JSON string with chart spec and the API endpoint to fetch data from.
    """
    specs = {
        "bar": {
            "$schema": "[vega.github.io](https://vega.github.io/schema/vega-lite/v5.json)",
            "title": title,
            "mark": "bar",
            "encoding": {
                "x": {"field": "zone", "type": "nominal", "title": "Zone"},
                "y": {"field": "count", "type": "quantitative", "title": "Count"},
                "color": {"field": "status", "type": "nominal"},
            },
        },
        "line": {
            "$schema": "[vega.github.io](https://vega.github.io/schema/vega-lite/v5.json)",
            "title": title,
            "mark": "line",
            "encoding": {
                "x": {"field": "date", "type": "temporal", "title": "Date"},
                "y": {"field": "count", "type": "quantitative", "title": "Count"},
                "color": {"field": "category", "type": "nominal"},
            },
        },
        "pie": {
            "$schema": "[vega.github.io](https://vega.github.io/schema/vega-lite/v5.json)",
            "title": title,
            "mark": "arc",
            "encoding": {
                "theta": {"field": "value", "type": "quantitative"},
                "color": {"field": "category", "type": "nominal"},
            },
        },
    }

    spec = specs.get(chart_type, specs["bar"])

    return json.dumps({
        "chart_spec": spec,
        "data_endpoint": "/analytics/trends",
        "description": description,
        "render_hint": "Pass chart_spec to your Vega-Lite renderer with data from data_endpoint",
    })
