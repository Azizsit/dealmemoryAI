from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from backend.app.db.session import get_db
from backend.app.db.models import Deal
from pydantic import BaseModel

router = APIRouter()

class DealCreate(BaseModel):
    name: str

class DealSchema(BaseModel):
    id: int
    name: str
    status: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[DealSchema])
async def list_deals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Deal))
    return result.scalars().all()

@router.post("/", response_model=DealSchema)
async def create_deal(deal_in: DealCreate, db: AsyncSession = Depends(get_db)):
    new_deal = Deal(name=deal_in.name)
    db.add(new_deal)
    await db.commit()
    await db.refresh(new_deal)
    return new_deal

@router.get("/{deal_id}", response_model=DealSchema)
async def get_deal(deal_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.get(Deal, deal_id)
    if not result:
        raise HTTPException(status_code=404, detail="Deal not found")
    return result
