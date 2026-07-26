import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed to custom domain (juanjbarreraj.com) at root
export default defineConfig({
  base: "/",
  plugins: [react()],
});
