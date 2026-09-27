import pytest
import asyncio
from httpx import AsyncClient
from backend.app.main import app
from backend.app.db.session import engine
from backend.app.db.models import Base

@pytest.fixture(scope="session", autouse=True)
async def setup_database():
    # Create tables for testing
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Clean up could go here if needed

@pytest.mark.asyncio
async def test_full_mvp_flow():
    """
    End-to-end test of the DealMemory AI loop:
    Deal -> Interaction Note -> Extraction -> Briefing
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # 1. Create a Deal
        deal_resp = await ac.post("/api/v1/deals/", json={"name": "Apex Foods Expansion"})
        assert deal_resp.status_code == 200
        deal_id = deal_resp.json()["id"]

        # 2. Submit an Interaction Note with a clear objection and promise
        note_content = "Client mentioned the delivery lead time is too long (Objection), I promised to check with the warehouse and email them by Tuesday (Promise)."
        inter_resp = await ac.post("/api/v1/interactions/", json={
            "deal_id": deal_id,
            "content": note_content,
            "interaction_type": "Note"
        })
        assert inter_resp.status_code == 200
        interaction_id = inter_resp.json()["id"]

        # 3. Generate the Briefing
        briefing_resp = await ac.get(f"/api/v1/briefings/{deal_id}/briefing")
        assert briefing_resp.status_code == 200
        data = briefing_resp.json()

        briefing_text = data["briefing"].lower()

        # 4. Verify: The briefing should mention the objection/promise and cite the interaction
        # We check for a citation pattern like [Int #X] or simply the interaction ID
        assert "lead time" in briefing_text or "delivery" in briefing_text
        assert "promise" in briefing_text or "tuesday" in briefing_text

        # Check for citation of the interaction ID
        citation = f"#{interaction_id}"
        assert citation in briefing_text or str(interaction_id) in briefing_text

        # 5. Verify Risk is not 'Low' because of the objection
        assert data["risk"]["score"] != "Low"
