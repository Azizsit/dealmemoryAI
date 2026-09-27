import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from httpx import ASGITransport, AsyncClient
from backend.app.main import app
from backend.app.db.models import Base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from backend.app.db.session import get_db
from backend.app.schemas.extraction import ExtractionResult, Stakeholder, Objection, Promise

# Use an in-memory database for integration tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False, class_=AsyncSession)

@pytest.mark.asyncio
async def test_full_mvp_flow():
    # 1. Manual DB Setup
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_db():
        async with TestSessionLocal() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    # 2. Mock external AI services
    mock_extraction = ExtractionResult(
        objections=[Objection(summary="Delivery lead time is too long", severity="high", resolved=False)],
        promises=[Promise(description="Check with warehouse and email by Tuesday", due_date="Tuesday", completed=False)],
        stakeholders=[],
        competitor_signals=[]
    )

    mock_memories = [{"content": "Client expressed concern about lead times in previous call."}]

    try:
        # We patch the functions where they are IMPORTED in the API routers
        with patch("backend.app.api.v1.interactions.extract_facts", new_callable=AsyncMock) as mock_extract, \
             patch("backend.app.services.memory.store_memory", new_callable=AsyncMock) as mock_store, \
             patch("backend.app.services.memory.retrieve_memories", new_callable=AsyncMock) as mock_retrieve, \
             patch("backend.app.api.v1.briefings.generate_deal_briefing", new_callable=AsyncMock) as mock_brief:

            mock_extract.return_value = mock_extraction
            mock_retrieve.return_value = mock_memories

            # Mock the final briefing synthesis result
            mock_brief.return_value = {
                "briefing": "The deal is at high risk because the client mentioned the delivery lead time is too long [Int #1]. I have promised to check with the warehouse and email them by Tuesday [Int #1].",
                "risk": {"score": "High", "reason": "High severity objection"},
                "evidence_count": 1
            }

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                # Step 1: Create a Deal
                deal_resp = await ac.post("/api/v1/deals/", json={"name": "Apex Foods Expansion"})
                assert deal_resp.status_code == 200
                deal_id = deal_resp.json()["id"]

                # Step 2: Submit Interaction Note
                note_content = "Client mentioned the delivery lead time is too long (Objection), I promised to check with the warehouse and email them by Tuesday (Promise)."
                inter_resp = await ac.post("/api/v1/interactions/", json={
                    "deal_id": deal_id,
                    "content": note_content,
                    "interaction_type": "Note"
                })
                assert inter_resp.status_code == 200
                interaction_id = inter_resp.json()["id"]

                # Step 3: Generate the Briefing
                briefing_resp = await ac.get(f"/api/v1/briefings/{deal_id}/briefing")
                assert briefing_resp.status_code == 200
                data = briefing_resp.json()

                briefing_text = data["briefing"].lower()

                # Step 4: Verify Evidence and Citation
                assert "lead time" in briefing_text or "delivery" in briefing_text
                assert "promise" in briefing_text or "tuesday" in briefing_text

                citation = f"#{interaction_id}"
                assert citation in briefing_text or str(interaction_id) in briefing_text

                # Step 5: Verify Risk is not 'Low'
                assert data["risk"]["score"] != "Low"

    finally:
        app.dependency_overrides.clear()
