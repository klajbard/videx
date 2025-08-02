import type { FastifyReply, FastifyRequest } from "fastify";
import { type VideoParams, videoParamsSchema } from "@/shared";
import { deleteVideo } from "../services";
import { createErrorMessage } from "../utils";

export const deleteVideoHandler = async (req: FastifyRequest<{ Params: VideoParams }>, reply: FastifyReply) => {
  const parsed = videoParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return reply.status(400).send(createErrorMessage(parsed.error.message));
  }

  try {
    await deleteVideo(parsed.data.id);
    reply.code(204);
  } catch {
    reply.code(404).send(createErrorMessage("Video not found"));
  }
};
