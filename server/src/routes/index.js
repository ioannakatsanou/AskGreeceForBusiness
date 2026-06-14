import { Router } from "express";
import health from "./health.js";
import opportunities from "./opportunities.js";
import compliance from "./compliance.js";
import dashboard from "./dashboard.js";

const api = Router();

api.use("/health", health);
api.use("/opportunities", opportunities);
api.use("/compliance", compliance);
api.use("/dashboard", dashboard);

export default api;
