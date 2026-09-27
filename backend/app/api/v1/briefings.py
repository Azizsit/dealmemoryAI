from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.db.session import get_db
from backend.app.services.briefing import generate_deal_briefing

router = APIRouter()

@router.get("/{deal_id}/briefing", response_model=None)
async def get_deal_briefing(deal_id: int, db: AsyncSession = Depends(get_db)):
    """
    Generates an evidence-backed briefing for the specified deal.
    """
    briefing_data = await generate_deal_briefing(db, deal_id)
    return briefing_data
