import { Router } from "express";
import { ok } from "../lib/respond.js";
import { config } from "../config/env.js";

const router = Router();

// GET /api/health — liveness + warm-up ping.
router.get("/", (req, res) => {
  return ok(res, {
    status: "ok",
    service: "tenderfit-ai-server",
    mode: config.procurementSourceMode,
    env: config.nodeEnv,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

export default router;
