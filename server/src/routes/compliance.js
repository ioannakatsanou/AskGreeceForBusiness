import { Router } from "express";
import { ok, fail } from "../lib/respond.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { elapsed } from "../middleware/requestTimer.js";
import { getOpportunityById } from "../services/searchService.js";
import { analyzeCompliance } from "../services/complianceService.js";

const router = Router();

// POST /api/compliance/analyze
// Body: { opportunityId | id, profile }
router.post(
  "/analyze",
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const opportunityId = body.opportunityId || body.id;
    const profile = body.profile;

    if (!opportunityId) {
      return fail(res, "BAD_REQUEST", "opportunityId is required.", 400, { tookMs: elapsed(req) });
    }
    if (!profile || typeof profile !== "object") {
      return fail(res, "BAD_REQUEST", "A company profile object is required.", 400, {
        tookMs: elapsed(req),
      });
    }

    const opportunity = await getOpportunityById(opportunityId);
    if (!opportunity) {
      return fail(res, "NOT_FOUND", `No opportunity with id "${opportunityId}".`, 404, {
        tookMs: elapsed(req),
      });
    }

    const result = analyzeCompliance(opportunity, profile);
    return ok(res, result, { tookMs: elapsed(req) });
  })
);

export default router;
