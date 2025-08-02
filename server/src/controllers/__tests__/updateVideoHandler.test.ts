import type { Prisma, Video } from "@prisma/client";
import Fastify, { type FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ErrorResponse, OkResponse, UpdateVideoSchema } from "@/shared";
import { createVideoData, tagsFromString } from "@/shared";
import { testPrisma } from "../../../vitest.setup";
import { updateVideoHandler } from "../updateVideoHandler";

describe("updateVideoHandler", () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    fastify.put("/videos/:id", updateVideoHandler);
    await fastify.ready();
    vi.clearAllMocks();
  });

  it("updates a video", async () => {
    // Prepare
    const mockVideo = createVideoData({ title: "Original Title" });

    const update = {
      title: "Updated Title",
      duration: 1800,
      tags: "updated,test",
    } satisfies Prisma.VideoUpdateInput;

    const updatedVideo: Video = {
      ...mockVideo,
      ...update,
    };

    testPrisma.video.findUnique.mockResolvedValue(mockVideo);
    testPrisma.video.update.mockResolvedValue(updatedVideo);

    const updateData: UpdateVideoSchema = {
      ...update,
      tags: tagsFromString(update.tags),
    };

    // Action
    const response = await fastify.inject({
      method: "PUT",
      url: `/videos/${mockVideo.id}`,
      payload: updateData,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findUnique).toHaveBeenCalledWith({
      where: { id: mockVideo.id },
    });
    expect(testPrisma.video.update).toHaveBeenCalledWith({
      where: { id: mockVideo.id },
      data: {
        title: "Updated Title",
        tags: "updated,test",
        duration: 1800,
      },
    });

    const body = response.json<OkResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toEqual(
      expect.objectContaining({
        id: mockVideo.id,
        title: "Updated Title",
        duration: 1800,
        tags: ["updated", "test"],
      }),
    );
  });

  it("updates only provided fields", async () => {
    // Prepare
    const mockVideo = createVideoData({
      title: "Original Title",
      duration: 1200,
      tags: "original,tags",
    });

    const update = {
      title: "Updated Title",
    } satisfies Prisma.VideoUpdateInput;

    const updatedVideo: Video = {
      ...mockVideo,
      ...update,
    };

    testPrisma.video.findUnique.mockResolvedValue(mockVideo);
    testPrisma.video.update.mockResolvedValue(updatedVideo);

    const updateData: UpdateVideoSchema = {
      title: "Updated Title",
    };

    // Action
    const response = await fastify.inject({
      method: "PUT",
      url: `/videos/${mockVideo.id}`,
      payload: updateData,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.update).toHaveBeenCalledWith({
      where: { id: mockVideo.id },
      data: {
        title: "Updated Title",
      },
    });

    const body = response.json<OkResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toEqual(
      expect.objectContaining({
        id: mockVideo.id,
        title: "Updated Title",
        duration: 1200,
        tags: ["original", "tags"],
      }),
    );
  });

  it("returns 404 when video does not exist", async () => {
    // Prepare
    testPrisma.video.findUnique.mockResolvedValue(null);

    const updateData: UpdateVideoSchema = {
      title: "Updated Title",
      duration: 1800,
      tags: ["updated", "test"],
    };

    // Action
    const response = await fastify.inject({
      method: "PUT",
      url: "/videos/999999",
      payload: updateData,
    });

    // Assert
    expect(response.statusCode).toBe(404);
    expect(testPrisma.video.findUnique).toHaveBeenCalledWith({
      where: { id: 999999 },
    });
    expect(testPrisma.video.update).not.toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toBe("Video not found");
  });

  it("returns 400 when invalid id is provided", async () => {
    // Prepare
    const updateData: UpdateVideoSchema = {
      title: "Updated Title",
      duration: 1800,
      tags: ["updated", "test"],
    };

    // Action
    const response = await fastify.inject({
      method: "PUT",
      url: "/videos/invalid",
      payload: updateData,
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(testPrisma.video.findUnique).not.toHaveBeenCalled();
    expect(testPrisma.video.update).not.toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toContain("id invalid input: expected number, received nan");
  });

  it("returns 400 when invalid parameters are provided", async () => {
    // Prepare
    const updateData = {
      title: "",
      duration: -1,
      tags: ["test"],
    };

    // Action
    const response = await fastify.inject({
      method: "PUT",
      url: "/videos/1",
      payload: updateData,
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(testPrisma.video.findUnique).not.toHaveBeenCalled();
    expect(testPrisma.video.update).not.toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toContain("title too small: expected string to have >=1 characters");
    expect(body.errors[1]).toContain("duration too small: expected number to be >=1");
  });

  it("handles empty tags array", async () => {
    // Prepare
    const mockVideo = createVideoData({
      title: "Original Title",
      duration: 1200,
      tags: "original,tags",
    });

    const update = {
      title: "Updated Title",
      duration: 1800,
      tags: "",
    } satisfies Prisma.VideoUpdateInput;

    const updatedVideo: Video = {
      ...mockVideo,
      ...update,
    };

    testPrisma.video.findUnique.mockResolvedValue(mockVideo);
    testPrisma.video.update.mockResolvedValue(updatedVideo);

    const updateData: UpdateVideoSchema = {
      title: "Updated Title",
      duration: 1800,
      tags: [],
    };

    // Action
    const response = await fastify.inject({
      method: "PUT",
      url: `/videos/${mockVideo.id}`,
      payload: updateData,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.update).toHaveBeenCalledWith({
      where: { id: mockVideo.id },
      data: {
        title: "Updated Title",
        duration: 1800,
        tags: "",
      },
    });

    const body = response.json<OkResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toEqual(
      expect.objectContaining({
        id: mockVideo.id,
        title: "Updated Title",
        tags: [],
      }),
    );
  });

  it("returns 500 when database operation fails", async () => {
    // Prepare
    testPrisma.video.findUnique.mockRejectedValue(new Error("Database error"));

    const updateData: UpdateVideoSchema = {
      title: "Updated Title",
    };

    // Action
    const response = await fastify.inject({
      method: "PUT",
      url: "/videos/1",
      payload: updateData,
    });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(testPrisma.video.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toBe("Failed to update video");
  });
});
