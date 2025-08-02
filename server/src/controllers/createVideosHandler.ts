import type { FastifyReply, FastifyRequest } from "fastify";
import type { Response } from "@/shared";
import { type CreateVideoSchema, createVideoSchema, type VideoSchema, videoFromEntity } from "@/shared";
import { createVideo } from "../services";
import { createErrorMessage, createSuccessMessage, parseZodIssues } from "../utils";

type CreateVideoReply = Response<VideoSchema>;

export const createVideosHandler = async (
  req: FastifyRequest<{ Body: CreateVideoSchema; Reply: CreateVideoReply }>,
  reply: FastifyReply<{ Reply: CreateVideoReply }>,
) => {
  const parsed = createVideoSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send(createErrorMessage(parseZodIssues(parsed.error.issues)));
  }

  try {
    const video = await createVideo(parsed.data);
    reply.code(201).send(createSuccessMessage(videoFromEntity(video)));
  } catch {
    reply.status(500).send(createErrorMessage("Unable to save video"));
  }
};
