import httpx
import json
import logging
from backend.app.schemas.extraction import ExtractionResult
from backend.app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5:7b"

async def extract_facts(text: str) -> ExtractionResult:
    """
    Uses Ollama to extract structured facts from an interaction note.
    """
    prompt = f"""
    Extract structured sales intelligence from the following interaction note.
    Return ONLY a JSON object that matches the following schema exactly:
    {{
        "stakeholders": [{{ "name": "...", "role": "...", "sentiment": "..." }}],
        "objections": [{{ "summary": "...", "severity": "...", "resolved": false }}],
        "promises": [{{ "description": "...", "due_date": "...", "completed": false }}],
        "competitor_signals": [{{ "competitor_name": "...", "signal": "..." }}]
    }}

    Note: {text}
    """

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json"
                }
            )
            response.raise_for_status()
            result = response.json()

            # Ollama puts the response in the 'response' field
            content = result.get("response", "{}")
            return ExtractionResult.model_validate_json(content)

        except Exception as e:
            logger.error(f"Ollama extraction failed: {e}")
            # Return empty result instead of crashing to allow note saving
            return ExtractionResult()
