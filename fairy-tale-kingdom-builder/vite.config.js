import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES
    ? "/nghiemhang/fairy-tale-kingdom-builder/"
    : "/",
  plugins: [react()],
  server: { port: 5173, open: true },
});
