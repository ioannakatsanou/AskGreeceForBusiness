import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset paths relative so the build works on GitHub Pages
// project sites without hardcoding the repo name. Routing uses HashRouter.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { port: 5173, open: true },
});
