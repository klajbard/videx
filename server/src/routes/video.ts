import type { FastifyInstance } from "fastify";
import { createVideoSchema, videoParamsSchema } from "@/shared";
import {
  createVideosHandler,
  deleteVideoHandler,
  getVideoHandler,
  listVideosHandler,
  updateVideoHandler,
} from "../controllers";

export const videoRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/videos", listVideosHandler);
  fastify.post("/videos", { schema: { body: createVideoSchema } }, createVideosHandler);
  fastify.get("/videos/:id", { schema: { params: videoParamsSchema } }, getVideoHandler);
  fastify.put("/videos/:id", { schema: { params: videoParamsSchema, body: createVideoSchema } }, updateVideoHandler);
  fastify.delete("/videos/:id", { schema: { params: videoParamsSchema } }, deleteVideoHandler);
};
