import httpx
import logging
from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# Hindsight is the persistent natural-language memory layer
HINSIGHT_URL = "http://localhost:8080" # Default Hindsight port

async def store_memory(deal_id: int, content: str):
    """
    Stores an interaction as a memory in Hindsight.
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            # Hindsight API typically uses a collection/document pattern
            response = await client.post(
                f"{HINSIGHT_URL}/memories",
                json={
                    "collection": f"deal_{deal_id}",
                    "content": content,
                    "metadata": {"source": "interaction"}
                }
            )
            response.raise_for_status()
        except Exception as e:
            logger.error(f"Hindsight storage failed: {e}")

async def retrieve_memories(deal_id: int, query: str, limit: int = 5):
    """
    Retrieves relevant memories from Hindsight based on a semantic query.
    """
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(
                f"{HINSIGHT_URL}/search",
                params={
                    "collection": f"deal_{deal_id}",
                    "query": query,
                    "limit": limit
                }
            )
            response.raise_for_status()
            return response.json().get("results", [])
        except Exception as e:
            logger.error(f"Hindsight retrieval failed: {e}")
            return []
