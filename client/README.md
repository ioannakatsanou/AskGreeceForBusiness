# TenderFit AI — Frontend (Phase 1 MVP)

React + Vite single-page app. **Mock data only** — no backend is connected yet.

## Run locally
```bash
cd client
npm install
npm run dev      # http://localhost:5173
```

## Build
```bash
npm run build    # outputs to client/dist
npm run preview  # preview the production build
```

## Stack
- **React 18** + **Vite 5**
- **React Router 6** (`HashRouter` — works on GitHub Pages, deep links + back button)
- Plain CSS design system (`src/styles/tokens.css` + `global.css`) — responsive, mobile-first
- **localStorage** for the company profile and recent searches

## Routes
| Path | Page |
|---|---|
| `/` | Home (hero, search, examples, recent searches) |
| `/search?q=` | Search results (≤5, loading / empty / error states) |
| `/tender/:id` | Tender details (AI summary, requirements) |
| `/company-profile` | Company profile form (saved to localStorage) |
| `/compliance/:id` | Compliance gap analysis + recommendation |
| `/dashboard` | Market-intelligence dashboard |

## Project structure
```
src/
├── main.jsx              # entry — HashRouter
├── App.jsx              # routes + ProfileProvider
├── styles/             # tokens.css, global.css
├── lib/                # constants, format, storage helpers
├── data/               # mockTenders, mockCompliance, mockDashboard
├── context/            # ProfileContext (localStorage-backed)
├── hooks/              # useLocalStorage, useRecentSearches, useMockFetch
├── components/
│   ├── layout/         # PageShell, Header, Logo, Footer, ScrollToTop
│   ├── feedback/       # Loading / Error / Empty / Skeleton states
│   └── ui/             # Button, Card, Badge, Chip, Field, StatTile, ScoreRing
├── features/
│   ├── search/         # SearchBar, ResultCard
│   └── profile/        # TagInput
└── routes/             # one file per page
```

## Notes for the next phase
- `useMockFetch` mirrors the intended `useTimeoutFetch` contract, so swapping the
  mock data layer (`src/data/*`) for the real backend API is a localized change.
- The compliance engine (`src/data/mockCompliance.js`) computes the verdict
  deterministically; in Phase 2+ this moves server-side with Claude writing the prose.
- Logo always navigates Home; all navigation is internal (no new tabs except the
  external "Official tender" links, which intentionally open in a new tab).
