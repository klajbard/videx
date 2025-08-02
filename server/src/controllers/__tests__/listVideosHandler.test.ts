import Fastify, { type FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ErrorResponse, PaginatedResponse } from "@/shared";
import { createVideosData } from "@/shared";
import { testPrisma } from "../../../vitest.setup";
import { listVideosHandler } from "../listVideosHandler";

describe("listVideosHandler", () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    fastify.get("/videos", listVideosHandler);
    await fastify.ready();
    vi.clearAllMocks();
  });

  it("returns paginated list of video", async () => {
    // Prepare
    const mockVideos = createVideosData(15);
    testPrisma.video.findMany.mockResolvedValue(mockVideos);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {},
      take: 11, // limit + 1 to check for next page
      orderBy: { id: "asc" },
    });

    const body = response.json<PaginatedResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toHaveLength(10);
    expect(body.nextPageToken).toBe(mockVideos.at(9)?.id.toString());
  });

  it("handles limit parameter", async () => {
    // Prepare
    const mockVideos = createVideosData(25);
    testPrisma.video.findMany.mockResolvedValue(mockVideos);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos?limit=5",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {},
      take: 6, // limit + 1
      orderBy: { id: "asc" },
    });

    const body = response.json<PaginatedResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toHaveLength(5);
    expect(body.nextPageToken).toBe(mockVideos.at(4)?.id.toString());
  });

  it("handles empty list of videos", async () => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {},
      take: 11,
      orderBy: { id: "asc" },
    });

    const body = response.json<PaginatedResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toHaveLength(0);
    expect(body.nextPageToken).toBeUndefined();
  });

  it("filters videos by title", async () => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos?search=JavaScript",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: "JavaScript" },
      },
      take: 11,
      orderBy: { id: "asc" },
    });
  });

  it("returns empty results for filter with no match", async () => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos?search=Vue",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: "Vue" },
      },
      take: 11,
      orderBy: { id: "asc" },
    });

    const body = response.json<PaginatedResponse>();
    expect(body.status).toBe("ok");
    expect(body.data).toHaveLength(0);
  });

  it("filters videos by tags", async () => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos?tags=advanced,javascript",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ tags: { contains: "advanced" } }, { tags: { contains: "javascript" } }],
      },
      take: 11,
      orderBy: { id: "asc" },
    });
  });

  it("filters videos by multiple tags", async () => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos?tags=react,frontend",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ tags: { contains: "react" } }, { tags: { contains: "frontend" } }],
      },
      take: 11,
      orderBy: { id: "asc" },
    });
  });

  it.each(["asc", "desc"] as const)("sorts by title %s", async (dir) => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: `/videos?sort=title&order=${dir}`,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {},
      take: 11,
      orderBy: { title: dir },
    });
  });

  it.each(["asc", "desc"] as const)("sorts by duration %s", async (dir) => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: `/videos?sort=duration&order=${dir}`,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {},
      take: 11,
      orderBy: { duration: dir },
    });
  });

  it("defaults to id and ascending when no sort provided", async () => {
    // Prepare
    const mockVideos = createVideosData(5);
    testPrisma.video.findMany.mockResolvedValue(mockVideos);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {},
      take: 11,
      orderBy: { id: "asc" },
    });

    const body = response.json<PaginatedResponse>();
    expect(body.status).toBe("ok");
    expect(body.data[0].title).toBe(mockVideos.at(0)?.title);
    expect(body.data[1].title).toBe(mockVideos.at(1)?.title);
    expect(body.data[2].title).toBe(mockVideos.at(2)?.title);
    expect(body.data[3].title).toBe(mockVideos.at(3)?.title);
    expect(body.data[4].title).toBe(mockVideos.at(4)?.title);
  });

  it("combines search, filtering, sorting, and pagination", async () => {
    // Prepare
    testPrisma.video.findMany.mockResolvedValue([]);

    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos?search=JavaScript&tags=javascript&sort=duration&order=desc&limit=2",
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: "JavaScript" },
        OR: [{ tags: { contains: "javascript" } }],
      },
      take: 3, // limit + 1
      orderBy: { duration: "desc" },
    });

    // Action
    const nextPageToken = 11;
    const nextPageResponse = await fastify.inject({
      method: "GET",
      url: `/videos?search=JavaScript&tags=javascript&sort=duration&order=desc&limit=2&nextPageToken=${nextPageToken}`,
    });

    // Assert
    expect(nextPageResponse.statusCode).toBe(200);
    expect(testPrisma.video.findMany).toHaveBeenCalledWith({
      where: {
        title: { contains: "JavaScript" },
        OR: [{ tags: { contains: "javascript" } }],
      },
      take: 3,
      orderBy: { duration: "desc" },
      cursor: { id: nextPageToken },
      skip: 1,
    });
  });

  it("returns 400 when invalid query parameters provided", async () => {
    // Action
    const response = await fastify.inject({
      method: "GET",
      url: "/videos?limit=invalid",
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(testPrisma.video.findMany).not.toHaveBeenCalled();

    const body = response.json<ErrorResponse>();
    expect(body.status).toBe("error");
    expect(body.errors[0]).toContain("Invalid input");
  });
});
