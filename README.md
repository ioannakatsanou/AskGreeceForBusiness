# TenderFit AI

**AI Procurement Opportunity & Compliance Copilot for Greek SMEs**

TenderFit AI helps small and medium-sized enterprises discover active public
procurement opportunities from Greek public-sector sources (ESIDIS / KIMDIS) and
decide whether they are qualified to bid. It is **not a search engine** — it is an
**AI decision-support system** that reasons about *fit* and produces an explainable
go / no-go recommendation.

> MBA Digital Business Strategies group project.

---

## Status

🟡 **Planning / pre-implementation.** No application code yet — this repository
currently holds the foundation documents under [`/docs`](./docs).

## The decisions that shape everything

| Decision | Choice |
|---|---|
| LLM provider | **Claude (Anthropic)** — `claude-opus-4-8`, via the official `@anthropic-ai/sdk` (server-side only) |
| Data sourcing | **Mock-first, live best-effort** — realistic Greek mock dataset is the reliable demo backbone; live ESIDIS/KIMDIS attempted in parallel behind an adapter |
| Frontend | React + Vite + React Router → **GitHub Pages** (HashRouter) |
| Backend | Node.js + Express → **Render** |
| Storage | Browser `localStorage` (company profile + recent searches); no server DB |

## Foundation documents

1. [Product Requirements Document](./docs/01-PRD.md)
2. [User Stories](./docs/02-USER-STORIES.md)
3. [System Architecture](./docs/03-ARCHITECTURE.md)
4. [Data Model](./docs/04-DATA-MODEL.md)
5. [API Design](./docs/05-API-DESIGN.md)
6. [Folder Structure](./docs/06-FOLDER-STRUCTURE.md)
7. [Component Architecture](./docs/07-COMPONENT-ARCHITECTURE.md)
8. [Development Roadmap](./docs/08-ROADMAP.md)
9. [AI Integration (Claude)](./docs/09-AI-INTEGRATION.md)

## Core user flow

Home → Search (keyword) → ≤5 active opportunities → Tender detail (AI summary +
key requirements) → Company profile → Compliance gap analysis (6 dimensions) →
Recommendation (Proceed / Proceed with Conditions / Proceed with Partner / Do Not Bid)
→ Market-intelligence dashboard.

## Hard constraints

- Search returns **max 5** active opportunities and **aborts at 10 seconds** — no infinite loading, ever.
- Every async surface has loading / error / empty states.
- The AI **never picks the verdict** — a deterministic rule engine does; the LLM only writes the explanation.
- The LLM API key lives **only** on the backend.
