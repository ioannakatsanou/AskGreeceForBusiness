import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { requestTimer } from "./middleware/requestTimer.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import api from "./routes/index.js";

export function createApp() {
  const app = express();

  // CORS — allow the frontend origin(s). "*" (default in dev) reflects any origin.
  const allowAny = config.allowedOrigins.includes("*");
  app.use(
    cors({
      origin: allowAny ? true : config.allowedOrigins,
      methods: ["GET", "POST", "OPTIONS"],
    })
  );

  app.use(express.json({ limit: "256kb" }));
  app.use(requestTimer);

  app.use("/api", api);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
