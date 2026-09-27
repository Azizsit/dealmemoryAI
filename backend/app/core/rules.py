from typing import List, Dict, Any
from backend.app.db.models import Extraction, Interaction
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

class RiskScore:
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

async def calculate_deal_risk(db: AsyncSession, deal_id: int) -> Dict[str, Any]:
    """
    Deterministically calculates deal risk based on extracted facts.
    Rules are handled in Python to ensure reliability and no LLM hallucination.
    """
    # Fetch all extractions for this deal
    result = await db.execute(select(Extraction).where(Extraction.deal_id == deal_id))
    extractions = result.scalars().all()

    if not extractions:
        return {"score": RiskScore.LOW, "reason": "No interaction data available."}

    # Flatten all extracted facts
    all_objections = []
    all_promises = []

    for ext in extractions:
        all_objections.extend(ext.data.get("objections", []))
        all_promises.extend(ext.data.get("promises", []))

    # Rule 1: High Severity Objections
    high_severity = [obj for obj in all_objections if obj.get("severity") == "high" and not obj.get("resolved")]
    if high_severity:
        return {
            "score": RiskScore.HIGH,
            "reason": f"Contains {len(high_severity)} unresolved high-severity objections."
        }

    # Rule 2: Unfulfilled Promises
    unfulfilled = [p for p in all_promises if not p.get("completed")]
    if len(unfulfilled) > 3:
        return {
            "score": RiskScore.HIGH,
            "reason": "Too many pending promises (over 3)."
        }

    # Rule 3: General Objections
    if all_objections:
        return {
            "score": RiskScore.MEDIUM,
            "reason": "Deal contains open objections."
        }

    return {"score": RiskScore.LOW, "reason": "No significant risks identified."}
