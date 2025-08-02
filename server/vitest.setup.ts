import type { PrismaClient } from "@prisma/client";
import { beforeEach, vi } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { prismaClient } from "@/prisma";

// Mock the correct path that matches the alias
vi.mock("@/prisma", () => ({
  __esModule: true,
  prismaClient: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(testPrisma);
});

export const testPrisma = prismaClient as unknown as DeepMockProxy<PrismaClient>;
