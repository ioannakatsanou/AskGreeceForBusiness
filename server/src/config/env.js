import dotenv from "dotenv";

dotenv.config();

function int(name, fallback) {
  const v = parseInt(process.env[name], 10);
  return Number.isFinite(v) ? v : fallback;
}

export const config = {
  port: int("PORT", 3001),
  nodeEnv: process.env.NODE_ENV || "development",
  procurementSourceMode: process.env.PROCUREMENT_SOURCE_MODE || "mock",
  searchTimeoutMs: int("SEARCH_TIMEOUT_MS", 10000),
  searchMaxResults: int("SEARCH_MAX_RESULTS", 5),
  // Comma-separated list, or "*" for any origin.
  allowedOrigins: (process.env.ALLOWED_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
};
