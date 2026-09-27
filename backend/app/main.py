from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1 import deals, interactions, briefings
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

# Include API Routers
app.include_router(deals.router, prefix="/api/v1/deals", tags=["Deals"])
app.include_router(interactions.router, prefix="/api/v1/interactions", tags=["Interactions"])
app.include_router(briefings.router, prefix="/api/v1/briefings", tags=["Briefings"])


@app.get("/api/v1/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
