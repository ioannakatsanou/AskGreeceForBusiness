import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On build (GitHub Pages project site) assets must be served from
// /AskGreeceForBusiness/. In dev we keep base "/" so the local server and the
// preview harness work at the root. Routing uses HashRouter, so deep links and
// the back button work on GitHub Pages without any SPA 404 workaround.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/AskGreeceForBusiness/" : "/",
  server: { port: 5173, open: true },
}));
