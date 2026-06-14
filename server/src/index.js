import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./lib/logger.js";

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`TenderFit AI server listening on http://localhost:${config.port}`);
  logger.info(`Mode: ${config.nodeEnv} · source: ${config.procurementSourceMode}`);
});

// Graceful shutdown.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    logger.info(`${signal} received — shutting down.`);
    server.close(() => process.exit(0));
  });
}
