import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages project sites are served from /<repo-name>/, not /.
  // The Pages workflow passes VITE_BASE_PATH="/lobos-barberia/"; everywhere
  // else (local dev, other hosts) it falls back to root.
  base: process.env.VITE_BASE_PATH || "/",
});
