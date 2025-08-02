import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@/shared", replacement: path.resolve(__dirname, "shared") },
      { find: "@/prisma", replacement: path.resolve(__dirname, "prisma") },
    ],
  },
});
