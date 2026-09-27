\# DealMemory AI — Project Rules



\## Product



DealMemory AI is an evidence-backed sales intelligence agent for traditional B2B SMEs.



It helps business owners and salespeople remember:

\- Customer requirements

\- Buyer stakeholders

\- Objections

\- Pending promises

\- Payment and delivery concerns

\- Competitor signals

\- Next follow-up actions



\## Target Demo



A packaging-material supplier sells cartons to food manufacturers.



Main demo customer: Apex Foods.



\## Technology Stack



\- Backend: Python FastAPI

\- Database: SQLite during local development

\- Local LLM: Ollama using qwen2.5:7b

\- Memory: Hindsight

\- Frontend: Next.js with TypeScript and Tailwind CSS



\## Architecture Rules



\- SQLite/PostgreSQL is the source of truth for structured business records.

\- Hindsight is the persistent natural-language memory layer.

\- Ollama extracts structured information and generates briefings.

\- Python rules calculate deal risk deterministically.

\- Every material AI claim must be linked to source interaction IDs.

\- Never let the LLM invent prices, approvals, promises, stakeholders, dates, payment terms, or competitor names.

\- If evidence is missing, return "unknown" or "not enough evidence".

\- Use Pydantic validation for all LLM JSON output.

\- Use synthetic data only for the hackathon demo.

\- Never commit secrets or .env files.



\## Development Rules



\- Use type hints.

\- Keep functions small and testable.

\- Use FastAPI for APIs.

\- Use async HTTP calls for Ollama and Hindsight.

\- Add tests for all critical backend services.

\- Do not add LangChain, Docker, authentication, WhatsApp API integration, or a predictive ML model in the MVP.

\- Build one complete workflow before adding extra features.



\## MVP Workflow



1\. User opens an existing deal.

2\. User adds a customer interaction note.

3\. Ollama extracts stakeholders, objections, promises, and competitor signals.

4\. User reviews extracted facts.

5\. Validated interaction is stored in SQLite and retained in Hindsight.

6\. User asks: "How should I follow up today?"

7\. Hindsight retrieves relevant memories.

8\. Rules engine computes risk.

9\. Ollama generates an evidence-backed deal briefing.

10\. User gets a follow-up message draft and can mark promises completed.

