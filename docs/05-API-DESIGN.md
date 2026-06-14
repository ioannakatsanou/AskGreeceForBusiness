# 5. API Design

REST/JSON. Base path: `/api`. All responses share an envelope
`{ ok, data?, error?, meta }`.

## 5.1 Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET  | `/api/health` | Liveness + warm-up ping |
| POST | `/api/search` | Keyword search → ≤5 active tenders |
| GET  | `/api/tender/:id` | Tender detail + AI summary / requirements |
| POST | `/api/compliance` | Gap analysis + recommendation |
| POST | `/api/dashboard` | Market-intelligence aggregates + AI insights |

## 5.2 Contracts

### POST `/api/search`
```jsonc
// Request
{ "keyword": "cybersecurity" }

// Response
{
  "ok": true,
  "data": { "results": [ /* Tender[≤5] */ ] },
  "meta": {
    "tookMs": 1840,
    "partial": false,
    "sources": { "ESIDIS": "ok", "KIMDIS": "timeout", "MOCK": "ok" }
  }
}
```
Rules: only `status="active"`; cap 5; hard server budget ~9s. `400` on invalid
keyword. Empty results return `200` with `results: []` (an empty state, not an error).
A client-side 10s abort handles the worst case.

### GET `/api/tender/:id`
```jsonc
{
  "ok": true,
  "data": { "tender": { /* Tender with .ai populated */ } },
  "meta": { "cached": true, "tookMs": 120, "aiStatus": "ok" }
}
```
Serve from cache if present; generate AI enrichment if missing (timeout 8s → return
the tender without `.ai` and `meta.aiStatus: "timeout"`). `404` on unknown id.

### POST `/api/compliance`
```jsonc
// Request
{ "tenderId": "abc123", "profile": { /* CompanyProfile */ } }

// Response
{ "ok": true, "data": { /* ComplianceResult */ }, "meta": { "tookMs": 5200 } }
```
`400` if the profile is invalid; `404` if the tender is unknown.

### POST `/api/dashboard`
```jsonc
// Request (optional context; defaults to a broad sweep)
{ "keywords": ["cybersecurity", "cloud migration"] }

// Response
{
  "ok": true,
  "data": {
    "activeOpportunities": 42,
    "totalMarketValue": 18750000,
    "upcomingDeadlines": [ { "tenderId": "...", "title": "...", "deadline": "..." } ],
    "mostActiveAuthorities": [ { "name": "...", "count": 7 } ],
    "topCategories": [ { "cpvLabel": "IT services", "count": 12 } ],
    "certificationTrends": [ { "certification": "ISO 27001", "demandCount": 9 } ],
    "aiInsights": [ "…", "…", "…" ]
  },
  "meta": { "tookMs": 3100, "partial": false }
}
```

## 5.3 Cross-cutting rules
- CORS allow-list: GitHub Pages origin only.
- Per-IP rate limiting (defensive).
- Every handler wrapped in a timeout guard; never hang a socket.
- Normalized errors: `{ "ok": false, "error": { "code": "...", "message": "..." } }`.
