# 6. Folder Structure

Monorepo with two deployables: `client/` (→ GitHub Pages) and `server/` (→ Render).

```
TenderFit-AI/
├── README.md
├── /docs                         # these foundation documents
├── /client                       # React + Vite SPA → GitHub Pages
│   ├── index.html
│   ├── vite.config.js            # base: "/<repo>/" for GH Pages
│   ├── package.json
│   ├── .env.example              # VITE_API_BASE_URL
│   ├── /.github/workflows/deploy.yml   # GH Pages CI
│   └── /src
│       ├── main.jsx
│       ├── App.jsx               # Router + layout
│       ├── /routes               # one folder per page
│       │   ├── Home/
│       │   ├── Search/
│       │   ├── Results/
│       │   ├── TenderDetail/
│       │   ├── CompanyProfile/
│       │   ├── Compliance/
│       │   └── Dashboard/
│       ├── /components
│       │   ├── layout/   (Header, Logo, NavBar, PageShell, Footer)
│       │   ├── feedback/ (Loading, ErrorState, EmptyState, Skeleton, AsyncBoundary)
│       │   └── ui/       (Button, Card, Badge, Field, Chip, StatTile)
│       ├── /features
│       │   ├── search/     (SearchBar, ResultCard, RecentSearches)
│       │   ├── tender/     (TenderHeader, RequirementsList, AISummary)
│       │   ├── profile/    (ProfileForm, sections…, useProfile)
│       │   ├── compliance/ (GapCard, GapGrid, RecommendationBanner)
│       │   └── dashboard/  (StatGrid, AuthoritiesList, TrendsChart, InsightsPanel)
│       ├── /api             # apiClient.js, endpoints.js (fetch + abort)
│       ├── /hooks           # useAsync, useLocalStorage, useProfile, useTimeoutFetch
│       ├── /lib             # storage.js, format.js (EUR/date), constants.js
│       ├── /context         # ProfileContext
│       └── /styles          # global.css, tokens.css (responsive)
└── /server                       # Node + Express → Render
    ├── package.json
    ├── .env.example              # PORT, ANTHROPIC_API_KEY, ALLOWED_ORIGIN, ESIDIS_*, KIMDIS_*
    └── /src
        ├── index.js              # bootstrap
        ├── app.js                # express app, cors, middleware
        ├── /routes               # search, tender, compliance, dashboard, health
        ├── /controllers
        ├── /services
        │   ├── searchService.js
        │   ├── complianceService.js   # deterministic gap engine
        │   ├── dashboardService.js
        │   └── aiService.js           # Claude wrapper (summaries, insights, prose)
        ├── /adapters
        │   ├── ProcurementSource.js   # interface
        │   ├── esidisAdapter.js
        │   ├── kimdisAdapter.js
        │   ├── mockAdapter.js         # primary demo dataset (mock-first)
        │   └── normalize.js           # → Tender model
        ├── /data
        │   └── mock-tenders.json      # realistic Greek seed data
        ├── /lib                  # cache.js (TTL), timeout.js (budget), logger.js
        ├── /middleware           # errorHandler, rateLimit, requestTimer
        └── /config               # env.js
```

## Notes
- The two packages have **independent** `package.json` files and deploy pipelines.
- `mockAdapter.js` + `mock-tenders.json` are first-class, not throwaway — they are
  the reliable demo backbone (mock-first decision).
- `aiService.js` is the only module that imports `@anthropic-ai/sdk`; nothing else
  touches the LLM or its key.
