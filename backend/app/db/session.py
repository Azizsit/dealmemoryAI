from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.core.config import settings
import os

# Create a fully qualified absolute path to the database file
# This prevents "unable to open database file" errors on Windows
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
db_path = os.path.join(base_dir, settings.DATABASE_URL)
DATABASE_URL = f"sqlite+aiosqlite:///{db_path}"

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
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
