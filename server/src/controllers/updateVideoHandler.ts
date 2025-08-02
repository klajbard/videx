import type { FastifyReply, FastifyRequest } from "fastify";
import type { Response } from "@/shared";
import {
  type UpdateVideoSchema,
  updateVideoSchema,
  type VideoParams,
  type VideoSchema,
  videoFromEntity,
  videoParamsSchema,
} from "@/shared";
import { getVideo, updateVideo } from "../services";
import { createErrorMessage, createSuccessMessage, parseZodIssues } from "../utils";

type UpdateVideoReply = Response<VideoSchema>;

export const updateVideoHandler = async (
  req: FastifyRequest<{
    Body: UpdateVideoSchema;
    Params: VideoParams;
    Reply: UpdateVideoReply;
  }>,
  reply: FastifyReply<{ Reply: UpdateVideoReply }>,
) => {
  const parsed = videoParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    return reply.status(400).send(createErrorMessage(parseZodIssues(parsed.error.issues)));
  }

  const { id } = parsed.data;

  const createVideo = updateVideoSchema.safeParse(req.body);

  if (!createVideo.success) {
    return reply.status(400).send(createErrorMessage(parseZodIssues(createVideo.error.issues)));
  }

  try {
    const video = await getVideo(id);

    if (video === null) {
      return reply.code(404).send(createErrorMessage("Video not found"));
    }

    const updated = await updateVideo(id, createVideo.data);
    return reply.send(createSuccessMessage(videoFromEntity(updated)));
  } catch {
    return reply.code(500).send(createErrorMessage("Failed to update video"));
  }
};
