from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analytics, auth, chat, trees
from app.config import settings
from app.core.exceptions import general_exception_handler, http_exception_handler
from app.db.session import supabase

app = FastAPI(
    title="ForestGuard AI",
    description="AI-powered forest monitoring and illegal logging detection",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(auth.router)
app.include_router(trees.router)
app.include_router(analytics.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "ForestGuard AI",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ForestGuard AI",
    }


@app.get("/supabase-health")
async def supabase_health():
    if supabase is None:
        return {
            "ok": False,
            "message": "Supabase is not configured. Check .env.",
        }

    try:
        response = (
            supabase.table("zones")
            .select("id")
            .limit(1)
            .execute()
        )

        return {
            "ok": True,
            "message": "Supabase connection works.",
            "data": response.data,
        }

    except Exception as error:
        return {
            "ok": False,
            "message": str(error),
        }