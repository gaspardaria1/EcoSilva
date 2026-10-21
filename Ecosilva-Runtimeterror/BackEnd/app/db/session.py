from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from supabase import create_client

from app.config import settings


# Supabase REST client
supabase = None

if settings.supabase_url and settings.supabase_key:
    supabase = create_client(settings.supabase_url, settings.supabase_key)


# Optional direct PostgreSQL connection
engine = None
AsyncSessionLocal = None

if settings.database_url:
    engine = create_async_engine(
        settings.database_url,
        echo=settings.environment == "development",
        pool_size=5,
        max_overflow=10,
    )

    AsyncSessionLocal = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )


async def get_db():
    if AsyncSessionLocal is None:
        raise HTTPException(
            status_code=503,
            detail="DATABASE_URL is not configured. Use Supabase REST routes or add direct Postgres DATABASE_URL.",
        )

    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()