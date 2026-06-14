import { getProcurementSource } from "../adapters/index.js";
import { withTimeout } from "../lib/timeout.js";
import { config } from "../config/env.js";

// Search with a hard timeout and an enforced max-result cap.
export async function searchOpportunities(query, requestedLimit) {
  const source = getProcurementSource();
  const limit = clampLimit(requestedLimit);

  const results = await withTimeout(
    source.searchOpportunities(query, { limit }),
    config.searchTimeoutMs
  );

  return results.slice(0, limit);
}

export async function getOpportunityById(id) {
  const source = getProcurementSource();
  return withTimeout(source.getOpportunityById(id), config.searchTimeoutMs);
}

function clampLimit(requested) {
  const max = config.searchMaxResults;
  const n = parseInt(requested, 10);
  if (!Number.isFinite(n) || n <= 0) return max;
  return Math.min(n, max);
}
