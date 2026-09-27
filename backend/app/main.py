from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="DealMemory AI API",
    version="0.1.0",
    description="Backend API for DealMemory AI.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}