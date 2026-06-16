import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/nghiemhang/chatgpt-clone/" : "/",
  plugins: [react()],
  server: { port: 5175, open: true },
});
