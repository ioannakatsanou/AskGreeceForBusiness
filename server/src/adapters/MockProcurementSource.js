import { ProcurementSource } from "./ProcurementSource.js";
import { OPPORTUNITIES } from "../data/mockOpportunities.js";

// In-memory procurement source backed by the mock dataset.
export class MockProcurementSource extends ProcurementSource {
  async searchOpportunities(query, options = {}) {
    const { limit } = options;
    const q = (query || "").trim().toLowerCase();

    let results = OPPORTUNITIES.filter((o) => o.status === "active");

    if (q) {
      results = results.filter((o) => {
        const haystack = [
          o.title,
          o.contractingAuthority,
          o.category,
          ...(o.keywords || []),
          ...(o.cpvCodes || []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    return typeof limit === "number" ? results.slice(0, limit) : results;
  }

  async getOpportunityById(id) {
    return OPPORTUNITIES.find((o) => o.id === id) || null;
  }
}
