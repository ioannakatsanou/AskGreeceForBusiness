// Central API client. Each call tries the backend first (when configured and
// reachable) and transparently falls back to the local mock data layer if the
// backend is missing, slow, or errors. Pages don't need to know which path ran —
// they always get the same data shapes.
//
// Backend base URL resolution:
//   1. VITE_API_BASE_URL if set (e.g. the Render URL in production)
//   2. http://localhost:3001 in dev (so `npm run dev` uses the local server)
//   3. otherwise undefined → mock-only

import { searchTenders, getTenderById } from "../data/mockTenders.js";
import { runComplianceAnalysis } from "../data/mockCompliance.js";
import { DASHBOARD } from "../data/mockDashboard.js";
import { MAX_RESULTS, MOCK_LATENCY } from "../lib/constants.js";

const BASE =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:3001" : undefined);

const FETCH_TIMEOUT_MS = 8000;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Try the backend; throws on any failure so callers can fall back.
async function fetchBackend(path, options = {}) {
  if (!BASE) throw new Error("backend-not-configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json || json.ok === false) {
      throw new Error(json?.error?.message || `backend ${res.status}`);
    }
    return json.data;
  } finally {
    clearTimeout(timer);
  }
}

// Expose which path served the data (handy for a "mock mode" badge later).
export const apiMeta = { lastSource: null };

async function withFallback(backendFn, mockFn) {
  try {
    const data = await backendFn();
    apiMeta.lastSource = "backend";
    return data;
  } catch {
    await delay(MOCK_LATENCY); // keep loading states visible in mock mode
    const data = await mockFn();
    apiMeta.lastSource = "mock";
    return data;
  }
}

export function searchOpportunities(keyword) {
  return withFallback(
    async () => {
      const data = await fetchBackend(
        `/api/opportunities/search?q=${encodeURIComponent(keyword || "")}&limit=${MAX_RESULTS}`
      );
      return data.results;
    },
    () => searchTenders(keyword).slice(0, MAX_RESULTS)
  );
}

export function getOpportunity(id) {
  return withFallback(
    async () => {
      const data = await fetchBackend(`/api/opportunities/${encodeURIComponent(id)}`);
      return data.opportunity;
    },
    () => getTenderById(id)
  );
}

export function analyzeCompliance(opportunityId, profile) {
  return withFallback(
    () =>
      fetchBackend(`/api/compliance/analyze`, {
        method: "POST",
        body: JSON.stringify({ opportunityId, profile }),
      }),
    () => {
      const tender = getTenderById(opportunityId);
      if (!tender) throw new Error("Opportunity not found");
      return runComplianceAnalysis(tender, profile);
    }
  );
}

export function getDashboard() {
  return withFallback(
    () => fetchBackend(`/api/dashboard`),
    () => DASHBOARD
  );
}
