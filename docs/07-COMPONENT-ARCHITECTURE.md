# 7. Component Architecture

## 7.1 Routing tree (HashRouter)
```
<App>
 └── <PageShell>            // Header(+Logo→Home), NavBar, <Outlet/>, Footer
      ├── "/"               → <Home>
      ├── "/search"         → <Search>
      ├── "/results"        → <Results>
      ├── "/tender/:id"     → <TenderDetail>
      ├── "/company-profile"→ <CompanyProfile>
      ├── "/compliance/:id" → <Compliance>
      ├── "/dashboard"      → <Dashboard>
      └── "*"               → <NotFound> (redirect Home)
```

## 7.2 State management
- **ProfileContext** (React Context) wraps the app, backed by `useLocalStorage`.
  Single source of truth for the company profile across Profile + Compliance pages.
- **No Redux** — overkill for the MVP. Local component state + Context + a reusable
  `useAsync` / `useTimeoutFetch` hook for fetches.
- **Search → results handoff:** results passed via Router state + cached in a
  lightweight in-memory module so `/results` survives without refetch, and
  `/tender/:id` can refetch by id on deep-link/refresh.

## 7.3 Reusable primitives (built once, used everywhere)
| Component | Responsibility |
|---|---|
| `PageShell` | Consistent layout, nav, max-width, responsive padding |
| `Logo` | Always `navigate("/")` on click |
| `AsyncBoundary` | Wraps any fetch surface: renders Loading / Error / Empty / data |
| `Loading` / `Skeleton` | Spinners + skeleton cards |
| `EmptyState` | Icon + message + CTA (search, dashboard) |
| `ErrorState` | Message + Retry button |
| `StatTile` | Dashboard metric tile |
| `Badge` / `Chip` | CPV codes, source system, gap status, keywords |

## 7.4 Page → feature → data wiring (key screens)
- **Search**: `SearchBar` + suggested `Chip`s + `RecentSearches`. On submit →
  `useTimeoutFetch(/api/search, 10s)` → navigate `/results`.
- **Results**: maps `ResultCard[]` (title, authority, budget, deadline, CPV badge,
  source badge). Empty/timeout/error via `AsyncBoundary`. Card → `/tender/:id`.
- **TenderDetail**: `TenderHeader` + `AISummary` + `RequirementsList` + official link.
  CTA: "Run Compliance Check" → `/compliance/:id` (guards profile existence).
- **CompanyProfile**: sectioned `ProfileForm` (Company / Capabilities / Coverage /
  Delivery / Team) with validation; saves to `localStorage`; shows "Saved ✓".
- **Compliance**: if no profile → `EmptyState` CTA to profile. Else
  `RecommendationBanner` (color-coded verdict) + `GapGrid` of 6 `GapCard`s
  (status, requirement vs. your value, explanation).
- **Dashboard**: `StatGrid` (active opps, market value), `upcomingDeadlines`,
  `AuthoritiesList`, `topCategories`, `certificationTrends` (`TrendsChart`),
  `InsightsPanel` (AI bullets). Each tile degrades independently.

## 7.5 Custom hooks
- `useLocalStorage(key, default)` — sync state ↔ storage.
- `useProfile()` — reads/writes ProfileContext; exposes `isComplete`.
- `useTimeoutFetch(url, opts, ms)` — fetch + AbortController + timeout →
  `{ data, loading, error, timedOut, retry }`.
- `useAsync(fn)` — generic async state machine.

## 7.6 Responsive design
- Mobile-first; CSS custom properties in `tokens.css` for spacing/typography/color.
- Breakpoints: ~600px (tablet), ~960px (desktop). Grids collapse to single column on
  mobile; nav becomes a compact menu.
