# TenderFit AI — Backend (Phase 2 scaffold)

Express API. **Mock data only** — no Claude, no live procurement APIs yet.

## Run
```bash
cd server
npm install
cp .env.example .env      # optional; sensible defaults are built in
npm run dev               # http://localhost:3001  (auto-reload)
npm start                 # production start
```

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Server status / warm-up |
| GET | `/api/opportunities/search?q=&limit=5` | ≤5 active opportunities |
| GET | `/api/opportunities/:id` | One opportunity by id |
| POST | `/api/compliance/analyze` | Gap analysis + recommendation |
| GET | `/api/dashboard` | Market-intelligence data |

All responses use the envelope `{ ok, data?, error?, meta }`.

### POST /api/compliance/analyze body
```json
{ "opportunityId": "esidis-2026-0451", "profile": { /* CompanyProfile */ } }
```
Returns the 6 gaps (Certification, Team Size, Budget, Geographic Coverage, Timeline,
Experience) plus `score`, `riskLevel`, `recommendation`, `recommendedActions`.

## Guards
- Hard search timeout (`SEARCH_TIMEOUT_MS`, default 10000ms) via `withTimeout`.
- Max results capped at `SEARCH_MAX_RESULTS` (default 5).
- CORS enabled for the frontend (`ALLOWED_ORIGIN`).
- Empty search → `200` with `results: []`. Unknown id → `404`. Timeout → `504`.

## Architecture
- **Adapter pattern**: `ProcurementSource` (interface) → `MockProcurementSource`.
  A factory (`adapters/index.js`) picks the source from `PROCUREMENT_SOURCE_MODE`.
  ESIDIS/KIMDIS live sources slot in here later without touching routes/services.
- **Services** hold logic (search, compliance engine, dashboard); routes stay thin.
- **Deterministic compliance verdict** (the LLM will only write prose in a later phase).

## Environment
| Var | Default | Meaning |
|---|---|---|
| `PORT` | 3001 | Listen port |
| `NODE_ENV` | development | Environment |
| `PROCUREMENT_SOURCE_MODE` | mock | `mock` only for now |
| `SEARCH_TIMEOUT_MS` | 10000 | Hard search timeout |
| `SEARCH_MAX_RESULTS` | 5 | Result cap |
| `ALLOWED_ORIGIN` | * | CORS allow-list (comma-separated, or `*`) |
