import { fail } from "../lib/respond.js";
import { logger } from "../lib/logger.js";
import { TimeoutError } from "../lib/timeout.js";
import { elapsed } from "./requestTimer.js";

// 404 for unmatched routes.
export function notFound(req, res) {
  return fail(res, "NOT_FOUND", `No route for ${req.method} ${req.path}`, 404);
}

// Central error handler. Timeouts → 504; everything else → 500.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const meta = { tookMs: elapsed(req) };
  if (err instanceof TimeoutError) {
    logger.warn(`Timeout on ${req.method} ${req.path}`);
    return fail(res, "TIMEOUT", "The request took too long. Please try again.", 504, meta);
  }
  logger.error(`Unhandled error on ${req.method} ${req.path}:`, err.message);
  return fail(res, "INTERNAL", "An unexpected error occurred.", 500, meta);
}
