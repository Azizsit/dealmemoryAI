from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from pydantic import BaseModel
from backend.app.db.session import get_db
from backend.app.db.models import Interaction, Extraction
from backend.app.services.ollama import extract_facts
from backend.app.core.config import get_settings

router = APIRouter()

class InteractionCreate(BaseModel):
    deal_id: int
    content: str
    interaction_type: str = "Note"

class InteractionResponse(BaseModel):
    id: int
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=InteractionResponse)
async def create_interaction(interaction_in: InteractionCreate, db: AsyncSession = Depends(get_db)):
    # 1. Save the raw interaction note to SQLite
    new_interaction = Interaction(
        deal_id=interaction_in.deal_id,
        content=interaction_in.content,
        interaction_type=interaction_in.interaction_type,
        timestamp=datetime.utcnow()
    )
    db.add(new_interaction)
    await db.commit()
    await db.refresh(new_interaction)

    # 2. Trigger Ollama extraction for structured facts
    # We do this after commit to ensure the interaction has an ID for the extraction link
    extracted_data = await extract_facts(new_interaction.content)

    # 3. Save the extracted facts to the Extraction table
    extraction = Extraction(
        interaction_id=new_interaction.id,
        deal_id=new_interaction.deal_id,
        data=extracted_data.model_dump()
    )
    db.add(extraction)
    await db.commit()

    # TODO: Phase 4 - Index content in Hindsight memory layer
    from backend.app.services.memory import store_memory
    await store_memory(new_interaction.deal_id, new_interaction.content)

    return new_interaction
