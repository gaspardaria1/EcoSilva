# app/ai/memory.py
from langchain_core.messages import HumanMessage, AIMessage
from typing import Dict, List

# In-memory store for the hackathon.
# Replace with Redis for production.
_session_store: Dict[str, List] = {}


def get_chat_history(session_id: str) -> List:
    return _session_store.get(session_id, [])


def add_to_history(session_id: str, human_msg: str, ai_msg: str) -> None:
    if session_id not in _session_store:
        _session_store[session_id] = []

    history = _session_store[session_id]
    history.append(HumanMessage(content=human_msg))
    history.append(AIMessage(content=ai_msg))

    # Keep last 20 messages (10 exchanges)
    if len(history) > 20:
        _session_store[session_id] = history[-20:]


def clear_session(session_id: str) -> None:
    _session_store.pop(session_id, None)
