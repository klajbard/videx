import { faker } from "@faker-js/faker";
import Fastify, { type FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type CreateVideoSchema, type ErrorResponse, type OkResponse, videoToEntity } from "@/shared";
import { testPrisma } from "../../../vitest.setup";
import { createVideosHandler } from "../createVideosHandler";

describe("createVideosHandler", () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    fastify.post("/videos", createVideosHandler);
    await fastify.ready();
    vi.clearAllMocks();
  });

  it("creates a new video successfully", async () => {
    // Prepare
    const videoData: CreateVideoSchema = {
      title: "New Video",
      duration: 1200,
      tags: ["tutorial", "beginner"],
      thumbnail_url: faker.internet.url(),
    };

    const mockVideo = videoToEntity({
      ...videoData,
      created_at: new Date().toISOString(),
      id: 1,
      views: 0,
    });

    testPrisma.video.create.mockResolvedValue(mockVideo);

    // Action
    const response = await fastify.inject({
      method: "POST",
      url: "/videos",
      payload: videoData,
    });

    // Assert
    expect(response.statusCode).toBe(201);
    expect(testPrisma.video.create).toHaveBeenCalledWith({
      data: {
        title: videoData.title,
        tags: "tutorial,beginner",
        duration: videoData.duration,
        thumbnail_url: videoData.thumbnail_url,
      },
    });

    const body = response.json<OkResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toEqual(expect.objectContaining(videoData));
  });

  it("creates video without tags provided", async () => {
    // Prepare
    const videoData: CreateVideoSchema = {
      title: "Video Without Tags",
      duration: 1800,
      thumbnail_url: faker.internet.url(),
    };

    const mockVideo = videoToEntity({
      ...videoData,
      created_at: new Date().toISOString(),
      id: 1,
      views: 0,
    });

    testPrisma.video.create.mockResolvedValue(mockVideo);

    // Action
    const response = await fastify.inject({
      method: "POST",
      url: "/videos",
      payload: videoData,
    });

    // Assert
    expect(response.statusCode).toBe(201);
    expect(testPrisma.video.create).toHaveBeenCalledWith({
      data: {
        title: videoData.title,
        tags: "",
        duration: videoData.duration,
        thumbnail_url: videoData.thumbnail_url,
      },
    });

    const body = response.json<OkResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toEqual(
      expect.objectContaining({
        ...videoData,
        tags: [],
      }),
    );
  });

  it("returns 400 when invalid properties provided", async () => {
    // Prepare
    const videoData: CreateVideoSchema = {
      title: "",
      duration: -1,
      tags: ["test"],
      thumbnail_url: faker.internet.url(),
    };

    // Action
    const response = await fastify.inject({
      method: "POST",
      url: "/videos",
      payload: videoData,
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(testPrisma.video.create).not.toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toContain("title too small: expected string to have >=1 characters");
    expect(body.errors[1]).toContain("duration too small: expected number to be >=1");
  });

  it("returns 500 when database operation fails", async () => {
    // Prepare
    const videoData: CreateVideoSchema = {
      title: "Test Video",
      duration: 1200,
      tags: ["test"],
      thumbnail_url: faker.internet.url(),
    };

    testPrisma.video.create.mockRejectedValue(new Error("Database error"));

    // Action
    const response = await fastify.inject({
      method: "POST",
      url: "/videos",
      payload: videoData,
    });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(testPrisma.video.create).toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toBe("Unable to save video");
  });
});
