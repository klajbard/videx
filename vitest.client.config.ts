import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./client/vitest.setup.ts"],
    include: ["./client/**/__tests__/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@/shared": path.resolve(__dirname, "./shared"),
      "@/prisma": path.resolve(__dirname, "./prisma"),
    },
  },
});
