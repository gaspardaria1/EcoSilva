# app/ai/tools/generate_map.py
from langchain_core.tools import tool
import json


@tool
def generate_map_tool(
    layer_type: str,
    zone_id: str = "",
    description: str = "",
) -> str:
    """
    Generate a GeoJSON map layer configuration for the frontend map.
    Use this when the user asks to see something 'on a map' or wants geographic visualization.

    Args:
        layer_type: One of 'trees', 'anomalies', 'cut_zones', 'heatmap'.
        zone_id: Optional zone to focus on.
        description: What the map should show.

    Returns:
        JSON with the API endpoint and layer config for the frontend.
    """
    endpoint_map = {
        "trees": "/trees/geojson",
        "anomalies": "/analytics/anomalies/geojson",
        "cut_zones": "/trees/geojson?status=cut",
        "heatmap": "/trees/geojson?status=anomaly",
    }

    endpoint = endpoint_map.get(layer_type, "/trees/geojson")
    if zone_id:
        endpoint += f"{'&' if '?' in endpoint else '?'}zone_id={zone_id}"

    return json.dumps({
        "layer_type": layer_type,
        "data_endpoint": endpoint,
        "description": description,
        "render_hint": (
            "Fetch GeoJSON from data_endpoint and render as a map layer. "
            "Color by 'status' property. Use red for 'cut', orange for 'anomaly', green for 'active'."
        ),
    })
