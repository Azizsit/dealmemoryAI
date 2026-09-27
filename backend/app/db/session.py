from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.core.config import settings
import os

# Database URL for SQLite async
DATABASE_URL = f"sqlite+aiosqlite:///{settings.DATABASE_URL}"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

async_session = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

async def get_db():
    async with async_session() as session:
        yield session
