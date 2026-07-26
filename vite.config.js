import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed as a GitHub Pages project site at /MyFirstPortfolio/
export default defineConfig({
  base: "/MyFirstPortfolio/",
  plugins: [react()],
});
