// Abstract procurement source. Concrete sources (Mock now; ESIDIS/KIMDIS later)
// implement this interface so the rest of the app never depends on a specific
// provider. See /docs/03-ARCHITECTURE.md (ADR-2).
export class ProcurementSource {
  /**
   * @param {string} query   keyword
   * @param {{ limit?: number }} options
   * @returns {Promise<Array>} normalized opportunities
   */
  // eslint-disable-next-line no-unused-vars
  async searchOpportunities(query, options = {}) {
    throw new Error("searchOpportunities() not implemented");
  }

  /**
   * @param {string} id
   * @returns {Promise<object|null>} a normalized opportunity, or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async getOpportunityById(id) {
    throw new Error("getOpportunityById() not implemented");
  }
}
