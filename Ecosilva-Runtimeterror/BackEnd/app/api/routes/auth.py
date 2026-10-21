# app/api/routes/auth.py
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user.get("email"),
        "role": user.get("role", "analyst"),
        "skill_level": user.get("skill_level", "L0"),
        "prompt_score_avg": user.get("prompt_score_avg", 0),
    }
