import { Router } from "express";
import { ok } from "../lib/respond.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { elapsed } from "../middleware/requestTimer.js";
import { getDashboard } from "../services/dashboardService.js";

const router = Router();

// GET /api/dashboard — market intelligence aggregates.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const data = getDashboard();
    return ok(res, data, { tookMs: elapsed(req) });
  })
);

export default router;
