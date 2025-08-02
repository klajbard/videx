import type { FastifyReply, FastifyRequest } from "fastify";
import type { Response } from "@/shared";
import { type VideoParams, type VideoSchema, videoFromEntity, videoParamsSchema } from "@/shared";
import { getVideo } from "../services";
import { createErrorMessage, createSuccessMessage } from "../utils";

type GetVideoReply = Response<VideoSchema>;

export const getVideoHandler = async (
  req: FastifyRequest<{
    Params: VideoParams;
    Reply: GetVideoReply;
  }>,
  reply: FastifyReply<{ Reply: GetVideoReply }>,
) => {
  const parsed = videoParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return reply.status(400).send(createErrorMessage(parsed.error.message));
  }

  try {
    const video = await getVideo(parsed.data.id);
    if (video === null) {
      return reply.code(404).send(createErrorMessage("Video not found"));
    }
    return reply.status(200).send(createSuccessMessage(videoFromEntity(video)));
  } catch {
    return reply.status(500).send(createErrorMessage("Failed to fetch video"));
  }
};
