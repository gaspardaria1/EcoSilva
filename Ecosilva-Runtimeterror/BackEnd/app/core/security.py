# app/core/security.py
from fastapi import HTTPException, status
from app.db.session import supabase


async def verify_supabase_token(token: str) -> dict:
    """
    Validate a Supabase JWT and return the user object.
    """
    try:
        response = supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )
        return {
            "id": response.user.id,
            "email": response.user.email,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )


async def get_user_profile(db, user_id: str) -> dict:
    """
    Fetch user profile from user_profiles table.
    Creates a default profile if it doesn't exist.
    """
    from sqlalchemy import text

    result = await db.execute(
        text("SELECT * FROM user_profiles WHERE id = :id"),
        {"id": user_id},
    )
    row = result.mappings().first()

    if not row:
        # Create default profile
        await db.execute(
            text("""
                INSERT INTO user_profiles (id, skill_level, prompt_score_avg, role)
                VALUES (:id, 'L0', 0, 'analyst')
                ON CONFLICT (id) DO NOTHING
            """),
            {"id": user_id},
        )
        await db.commit()
        return {
            "id": user_id,
            "skill_level": "L0",
            "prompt_score_avg": 0.0,
            "role": "analyst",
        }

    return dict(row)
