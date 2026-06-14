import { MockProcurementSource } from "./MockProcurementSource.js";
import { config } from "../config/env.js";
import { logger } from "../lib/logger.js";

let instance = null;

// Factory: returns the configured procurement source (singleton).
// Only "mock" is supported now; ESIDIS/KIMDIS land in a later phase.
export function getProcurementSource() {
  if (instance) return instance;

  switch (config.procurementSourceMode) {
    case "mock":
      instance = new MockProcurementSource();
      break;
    // case "live": instance = new LiveProcurementSource(); break;  // future
    default:
      logger.warn(
        `Unknown PROCUREMENT_SOURCE_MODE "${config.procurementSourceMode}" — falling back to mock.`
      );
      instance = new MockProcurementSource();
  }

  logger.info(`Procurement source: ${config.procurementSourceMode}`);
  return instance;
}
