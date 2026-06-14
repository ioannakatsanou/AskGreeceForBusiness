# 2. User Stories

Format: *As a [user], I want [capability], so that [value].* Each has acceptance
criteria (AC).

## Epic A — Discovery

### US-A1 — Keyword search
As an SME user, I want to search opportunities by keyword, so that I find relevant tenders fast.
- AC1: Input accepts free text + suggested chips (cybersecurity, cloud migration, ERP, consulting, software development).
- AC2: Returns ≤5 active opportunities.
- AC3: Search aborts at 10s and shows a timeout message — never spins forever.
- AC4: Empty result shows a clear empty state with suggestions.
- AC5: Recent searches saved to `localStorage` and shown on the search page.

### US-A2 — View tender detail
As a user, I want a full tender detail view, so that I can evaluate the opportunity.
- AC1: Shows title, contracting authority, budget, deadline, CPV, source system, official link.
- AC2: Shows AI executive summary and extracted key requirements.
- AC3: "Official tender link" opens the real source in a new tab.
- AC4: Deep-link `/tender/:id` works on refresh and via the back button.

## Epic B — Company Profile

### US-B1 — Create/edit profile
As a user, I want to enter my company profile, so that analysis is tailored to me.
- AC1: Captures all fields in the groups (Company, Capabilities, Coverage, Delivery, Team).
- AC2: Validates types (numbers, dates, budget min ≤ max).
- AC3: Persists to `localStorage`; survives refresh.
- AC4: Editable at any time; shows a "saved" state.

## Epic C — Compliance

### US-C1 — Gap analysis
As a user, I want a compliance gap analysis for a tender, so that I know if I qualify.
- AC1: Produces all 6 gaps (Certification, Team Size, Budget, Geographic Coverage, Timeline, Experience).
- AC2: Each gap has a status (Met / Partial / Gap), the requirement, my value, and a short explanation.
- AC3: Blocks gracefully if no profile exists → prompts the user to create one.
- AC4: Completes < 8s with a timeout fallback.

### US-C2 — Recommendation
As a user, I want a single recommendation, so that I can decide quickly.
- AC1: One of: Proceed / Proceed with Conditions / Proceed with Partner / Do Not Bid.
- AC2: Recommendation is justified by the gaps (explainable).
- AC3: Visual emphasis (color + label) on the verdict.

## Epic D — Dashboard

### US-D1 — Market intelligence
As a user, I want a dashboard, so that I understand the market at a glance.
- AC1: Shows active opportunities, total market value, upcoming deadlines, most
  active authorities, top categories, certification demand trends, AI market insights.
- AC2: Loads with skeletons; degrades gracefully if a metric can't compute.

## Epic E — Navigation & resilience (cross-cutting)
- **US-E1** Logo always returns Home.
- **US-E2** Browser back works across all routes.
- **US-E3** Every async surface has loading + error + empty states.
- **US-E4** No screen can hang indefinitely.
