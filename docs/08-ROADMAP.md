# 8. Development Roadmap

Phased and demo-driven. Each phase ends with something runnable.

## Phase 0 — Discovery & setup (foundation)
- **Spike (highest priority, highest risk):** investigate ESIDIS/KIMDIS real
  endpoints — protocol, auth, query params, response shape, rate limits. **Timebox
  it.** Output: an adapter contract + a captured sample payload. Given the
  *mock-first* decision, MockAdapter is the demo backbone regardless of the outcome.
- Scaffold the monorepo (`/client` Vite+React+Router, `/server` Express).
- CI: GitHub Pages workflow + Render service. Health endpoint + warm-up.
- Define the shared models (Tender, CompanyProfile, ComplianceResult) as the contract.
- **Exit:** a "hello" SPA on GH Pages calling `/api/health` on Render.

## Phase 1 — Search & tender (core retrieval)
- Backend: `ProcurementSource` interface + MockAdapter (seeded Greek data) + real
  adapters (best-effort) + normalize + cache + `/api/search`, `/api/tender/:id`.
- Frontend: Home, Search (with recent searches), Results, TenderDetail.
- Implement the 10s budget + AbortController + all empty/error/loading states.
- **Exit:** keyword → ≤5 active tenders → detail view, fully resilient.

## Phase 2 — AI enrichment
- `aiService` (Claude): executive summary + key-requirement extraction (server-side key).
- Wire into `/api/tender/:id` (lazy, timeout-guarded, separated from search).
- **Exit:** tender detail shows an AI summary + structured requirements; never blocks search.

## Phase 3 — Company profile
- `ProfileForm` (5 sections) + validation + `localStorage` + ProfileContext.
- **Exit:** profile persists across refresh; the Compliance page can read it.

## Phase 4 — Compliance engine
- Deterministic Gap Engine (6 dimensions) + scoring + verdict mapping.
- Claude for per-gap explanations + rationale prose (verdict stays deterministic).
- Frontend: Compliance page, GapGrid, RecommendationBanner; profile guard.
- **Exit:** end-to-end — search → tender → compliance → verdict.

## Phase 5 — Dashboard
- `dashboardService` aggregations + Claude insights; frontend `StatGrid` / trends /
  insights with independent degradation.
- **Exit:** dashboard renders all 7 required widgets.

## Phase 6 — Hardening & demo polish
- Responsive QA (mobile/tablet/desktop); back-button + deep-link QA on HashRouter.
- Cold-start mitigation, error-state copy, performance logging.
- Enrich the MockAdapter with realistic Greek tenders so the demo is reliable even if
  live APIs are down.
- **Exit:** demo-ready; no infinite loading; all states covered.

## Critical-path callout
`Phase 0 spike → Phase 1 search resilience → Phase 4 gap engine` is the spine. AI
(Phases 2 & 4-prose) and the Dashboard (Phase 5) are valuable but must never
destabilize the resilient core. If time compresses, the demo can ship on the
MockAdapter + full compliance and still tell the complete story.
