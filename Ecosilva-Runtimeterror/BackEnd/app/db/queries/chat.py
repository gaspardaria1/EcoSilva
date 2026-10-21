# app/db/queries/chat.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Optional
import uuid


async def get_or_create_session(
    db: AsyncSession,
    user_id: str,
    session_id: Optional[str] = None,
) -> dict:
    if session_id:
        result = await db.execute(
            text("SELECT * FROM chat_sessions WHERE id = :id AND user_id = :uid"),
            {"id": session_id, "uid": user_id},
        )
        row = result.mappings().first()
        if row:
            return dict(row)

    # Create new session
    new_id = str(uuid.uuid4())
    await db.execute(
        text("""
            INSERT INTO chat_sessions (id, user_id)
            VALUES (:id, :user_id)
        """),
        {"id": new_id, "user_id": user_id},
    )
    await db.commit()
    return {"id": new_id, "user_id": user_id}


async def save_message(
    db: AsyncSession,
    session_id: str,
    role: str,
    content: str,
    prompt_score: Optional[int] = None,
    tool_calls: Optional[dict] = None,
) -> None:
    await db.execute(
        text("""
            INSERT INTO chat_messages (id, session_id, role, content, prompt_score, tool_calls)
            VALUES (:id, :session_id, :role, :content, :prompt_score, :tool_calls::jsonb)
        """),
        {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "role": role,
            "content": content,
            "prompt_score": prompt_score,
            "tool_calls": str(tool_calls) if tool_calls else None,
        },
    )
    await db.commit()


async def get_session_messages(
    db: AsyncSession,
    session_id: str,
    limit: int = 20,
) -> list:
    result = await db.execute(
        text("""
            SELECT role, content, created_at, prompt_score
            FROM chat_messages
            WHERE session_id = :session_id
            ORDER BY created_at ASC
            LIMIT :limit
        """),
        {"session_id": session_id, "limit": limit},
    )
    return [dict(row) for row in result.mappings().all()]
