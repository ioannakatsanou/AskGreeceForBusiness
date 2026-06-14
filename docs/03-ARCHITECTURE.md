# 3. System Architecture

## 3.1 High-level topology
```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER (GitHub Pages — static)                             │
│  React + Vite SPA                                            │
│   • React Router (HashRouter for GH Pages)                  │
│   • localStorage: companyProfile, recentSearches            │
│   • API client (fetch + 10s AbortController)                │
└───────────────┬─────────────────────────────────────────────┘
                │ HTTPS (JSON)
                ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Render — Node.js + Express)                        │
│   Controllers → Services → Adapters                          │
│   • /api/search     → Procurement Adapter (ESIDIS/KIMDIS)   │
│   • /api/tender/:id → Procurement Adapter + AI summary      │
│   • /api/compliance → Gap Engine + AI explanations          │
│   • /api/dashboard  → Aggregation + AI insights             │
│   • In-memory cache (TTL) for tenders & summaries           │
│   • Per-request time-budget enforcement                     │
└───────┬──────────────────────────────┬─────────────────────┘
        │                              │
        ▼                              ▼
┌────────────────────┐      ┌───────────────────────────────┐
│ Greek Procurement  │      │  Anthropic API                 │
│ ESIDIS / KIMDIS    │      │  @anthropic-ai/sdk             │
│ (+ MockSource)     │      │  claude-opus-4-8 (server-side) │
└────────────────────┘      └───────────────────────────────┘
```

## 3.2 Architecture decision records (brief)
- **ADR-1: HashRouter, not BrowserRouter.** GitHub Pages can't do SPA server-side
  rewrites cleanly; HashRouter (`/#/search`) guarantees deep links + refresh + back
  button without 404s.
- **ADR-2: Adapter pattern for procurement sources.** ESIDIS and KIMDIS are wrapped
  behind a common `ProcurementSource` interface that returns a normalized `Tender`.
  A **MockSource** is the primary, reliable demo backbone (mock-first); real sources
  are attempted best-effort in parallel.
- **ADR-3: AI key stays server-side.** The frontend never holds the Anthropic key.
  All AI calls proxy through the backend.
- **ADR-4: Time-budget pattern.** Every external call gets an explicit timeout; the
  search controller enforces a global ~9s budget and returns partial results rather
  than failing.
- **ADR-5: Separate AI from retrieval.** Search returns tenders fast; executive
  summaries / requirements are generated on tender-detail (or lazily), so search
  never blocks on the LLM.
- **ADR-6: Deterministic verdict, AI prose.** The recommendation is chosen by a rule
  engine (testable, defensible); Claude only writes the per-gap explanations and the
  rationale paragraph.
- **ADR-7: Stateless backend.** No DB. User data lives in the browser; the backend
  caches only public tender data in memory.

## 3.3 Data flow — search (critical path)
```
User submits keyword
  → frontend starts 10s AbortController
  → POST /api/search { keyword }
       backend starts budget timer (~9s usable)
       → Adapter.search(keyword) across sources [Promise.allSettled, per-source timeout 7s]
       → normalize + filter active + cap to 5
       → cache results by tenderId
       ← 200 { results[≤5], meta:{ tookMs, partial, sources } }
  → render results; persist recent search locally
On 10s: abort → show "Search took too long" + retry
```

## 3.4 Data flow — compliance
```
/compliance/:id
  → load profile from localStorage (guard: redirect to profile if absent)
  → POST /api/compliance { tenderId, profile }
       backend: fetch tender (cache) → Gap Engine (deterministic rules)
                + Claude (per-gap explanations + rationale) [timeout 8s]
       ← { gaps[6], recommendation, rationale, score }
  → render gap cards + verdict banner
```

## 3.5 Resilience strategy
- AbortController on every frontend fetch (10s search / 8s compliance).
- Backend per-source timeouts; `Promise.allSettled` so one dead source ≠ total failure.
- In-memory TTL cache (tenders ~10 min, AI summaries ~30 min) to survive cold APIs.
- Pre-warm ping (`/api/health`) to defeat Render cold start.
- Every page implements a `{ loading, error, empty, data }` state machine.

## 3.6 Security & config
- CORS allow-list: only the GitHub Pages origin.
- Per-IP rate limiting (defensive).
- Secrets via environment variables on Render: `ANTHROPIC_API_KEY`, `ALLOWED_ORIGIN`,
  `ESIDIS_*`, `KIMDIS_*`. Frontend env: `VITE_API_BASE_URL` only (no secrets).
