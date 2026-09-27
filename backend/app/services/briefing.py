from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.app.db.models import Extraction, Interaction
from backend.app.core.rules import calculate_deal_risk
from backend.app.services.memory import retrieve_memories
from backend.app.services.ollama import OLLAMA_URL, OLLAMA_MODEL
import httpx
import logging

logger = logging.getLogger(__name__)

async def generate_deal_briefing(db: AsyncSession, deal_id: int) -> Dict[str, Any]:
    """
    Synthesizes structured extractions, semantic memories, and deterministic risk
    into an evidence-backed deal briefing.
    """
    # 1. Retrieve Structured Extractions
    result = await db.execute(select(Extraction).where(Extraction.deal_id == deal_id))
    extractions = result.scalars().all()

    # 2. Retrieve Semantic Memories from Hindsight
    # We use a generic query to get the most relevant recent context
    memories = await retrieve_memories(deal_id, "What are the key requirements and concerns for this deal?")

    # 3. Compute Deterministic Risk
    risk_data = await calculate_deal_risk(db, deal_id)

    # 4. Prepare Context for Ollama
    structured_context = "\n".join([
        f"Interaction #{ext.interaction_id}: {ext.data}"
        for ext in extractions
    ])

    memory_context = "\n".join([
        f"Memory: {mem.get('content', '')}"
        for mem in memories
    ])

    prompt = f"""
    You are a sales intelligence agent. Generate a deal briefing based on the provided evidence.

    RULES:
    1. Every claim MUST be linked to a source interaction ID (e.g., [Int #12]).
    2. If evidence is missing, state "unknown" or "not enough evidence".
    3. Never invent prices, dates, or stakeholder names.
    4. Integrate the current risk level: {risk_data['score']} ({risk_data['reason']}).

    STRUCTURED EVIDENCE:
    {structured_context}

    SEMANTIC MEMORIES:
    {memory_context}

    BRIEFING:
    """

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False
                }
            )
            response.raise_for_status()
            briefing_text = response.json().get("response", "No briefing generated.")

            return {
                "briefing": briefing_text,
                "risk": risk_data,
                "evidence_count": len(extractions)
            }
        except Exception as e:
            logger.error(f"Briefing generation failed: {e}")
            return {
                "briefing": "Error generating briefing.",
                "risk": risk_data,
                "evidence_count": len(extractions)
            }
