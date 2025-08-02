import Fastify, { type FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ErrorResponse } from "@/shared";
import { createVideoData } from "@/shared";
import { testPrisma } from "../../../vitest.setup";
import { deleteVideoHandler } from "../deleteVideoHandler";

describe("deleteVideoHandler", () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    fastify.delete("/videos/:id", deleteVideoHandler);
    await fastify.ready();
    vi.clearAllMocks();
  });

  it("deletes the video successfully", async () => {
    // Prepare
    const mockVideo = createVideoData({ title: "Video to delete" });
    testPrisma.video.delete.mockResolvedValue(mockVideo);

    // Action
    const response = await fastify.inject({
      method: "DELETE",
      url: `/videos/${mockVideo.id}`,
    });

    // Assert
    expect(response.statusCode).toBe(204);
    expect(response.body).toBe("");
    expect(testPrisma.video.delete).toHaveBeenCalledWith({
      where: { id: mockVideo.id },
    });
  });

  it("returns 404 when video to be deleted does not exist", async () => {
    // Prepare
    testPrisma.video.delete.mockRejectedValue(new Error("Record to delete does not exist"));

    // Action
    const response = await fastify.inject({
      method: "DELETE",
      url: "/videos/99",
    });

    // Assert
    expect(response.statusCode).toBe(404);
    expect(testPrisma.video.delete).toHaveBeenCalledWith({
      where: { id: 99 },
    });

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toBe("Video not found");
  });

  it("returns 400 when invalid id provided", async () => {
    // Action
    const response = await fastify.inject({
      method: "DELETE",
      url: "/videos/invalid",
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(testPrisma.video.delete).not.toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toContain("Invalid input");
  });
});
