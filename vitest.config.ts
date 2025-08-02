import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./server/vitest.setup.ts"],
    include: ["./**/__tests__/*.test.ts"],
  },
  resolve: {
    alias: {
      "@/shared": path.resolve(__dirname, "./shared"),
      "@/prisma": path.resolve(__dirname, "./prisma"),
    },
  },
});
