import { Router } from "express";
import { ok, fail } from "../lib/respond.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { elapsed } from "../middleware/requestTimer.js";
import { searchOpportunities, getOpportunityById } from "../services/searchService.js";
import { config } from "../config/env.js";

const router = Router();

// GET /api/opportunities/search?q=cybersecurity&limit=5
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const q = (req.query.q || "").toString();
    const results = await searchOpportunities(q, req.query.limit);
    return ok(
      res,
      { results, query: q },
      { tookMs: elapsed(req), count: results.length, max: config.searchMaxResults }
    );
  })
);

// GET /api/opportunities/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const opportunity = await getOpportunityById(req.params.id);
    if (!opportunity) {
      return fail(res, "NOT_FOUND", `No opportunity with id "${req.params.id}".`, 404, {
        tookMs: elapsed(req),
      });
    }
    return ok(res, { opportunity }, { tookMs: elapsed(req) });
  })
);

export default router;
