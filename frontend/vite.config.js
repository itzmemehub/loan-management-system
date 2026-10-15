import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the API is proxied through the Vite server, so the site and
// the API share one origin and the admin session cookie is first-party.
const backend = process.env.BACKEND_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": backend,
      "/uploads": backend,
    },
  },
});
