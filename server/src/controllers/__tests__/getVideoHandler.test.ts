import Fastify, { type FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ErrorResponse, OkResponse } from "@/shared";
import { videoFromEntity, videoToEntity } from "@/shared";
import { testPrisma } from "../../../vitest.setup";
import { getVideoHandler } from "../getVideoHandler";

describe("getVideoHandler", () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    fastify.get("/videos/:id", getVideoHandler);
    await fastify.ready();
    vi.clearAllMocks();
  });

  it("returns the video", async () => {
    // Prepare
    const mockVideo = videoToEntity({
      id: 1,
      title: "Test Video",
      duration: 1200,
      tags: ["test", "video"],
      thumbnail_url: "https://example.com/thumbnail.jpg",
      views: 100,
      created_at: new Date(),
    });

    testPrisma.video.findUnique.mockResolvedValue(mockVideo);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: `/videos/${mockVideo.id}`,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    const body = response.json<OkResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toEqual(
      expect.objectContaining({ ...videoFromEntity(mockVideo), created_at: mockVideo.created_at.toISOString() }),
    );
  });

  it("returns 404 when video does not exist", async () => {
    // Prepare
    testPrisma.video.findUnique.mockResolvedValue(null);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos/99",
    });

    // Assert
    expect(response.statusCode).toBe(404);
    expect(testPrisma.video.findUnique).toHaveBeenCalledWith({
      where: { id: 99 },
    });

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toBe("Video not found");
  });

  it("returns 400 for invalid id parameter", async () => {
    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos/invalid",
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(testPrisma.video.findUnique).not.toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toContain("Invalid input");
  });

  it("returns 500 when database operation fails", async () => {
    // Prepare
    testPrisma.video.findUnique.mockRejectedValue(new Error("Database error"));

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos/1",
    });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(testPrisma.video.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toBe("Failed to fetch video");
  });
});
