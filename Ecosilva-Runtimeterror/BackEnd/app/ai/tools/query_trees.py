# app/ai/tools/query_trees.py
from langchain_core.tools import tool


@tool
def query_trees_tool(natural_language_query: str) -> str:
    """
    Signal that a database query is needed for tree/forest data.
    The backend will execute the appropriate SQL based on the query intent.
    Use this for questions about tree inventory, cut trees, zones, counts, etc.

    Args:
        natural_language_query: The user's question about trees or forest data.

    Returns:
        A description of what data should be fetched and from which endpoint.
    """
    # This tool acts as a signal. The actual DB query happens in the chat route
    # using execute_tree_query(), which maps intent to safe SQL.
    # Returning the routing instruction lets the LLM cite the right endpoint.
    query_lower = natural_language_query.lower()

    if any(w in query_lower for w in ["cut", "illegal", "logging"]):
        endpoint = "/trees?status=cut"
        description = "Fetch cut trees from the database"
    elif any(w in query_lower for w in ["anomaly", "suspicious", "anomalies"]):
        endpoint = "/analytics/anomalies"
        description = "Fetch active anomalies"
    elif any(w in query_lower for w in ["zone", "region", "area"]):
        endpoint = "/zones"
        description = "Fetch zone summaries"
    elif any(w in query_lower for w in ["count", "how many", "total"]):
        endpoint = "/analytics/trends"
        description = "Fetch aggregate counts"
    else:
        endpoint = "/trees"
        description = "Fetch tree inventory"

    return f"Data available at: {endpoint} — {description}"
