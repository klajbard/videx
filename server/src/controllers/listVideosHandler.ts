import type { FastifyReply, FastifyRequest } from "fastify";
import type { CursorPaginatedResponse } from "@/shared";
import { type VideoSchema, type VideosParams, videoFromEntity, videosParamsSchema } from "@/shared";
import { listVideos } from "../services";
import { createErrorMessage, createSuccessMessage } from "../utils";

type ListVideosReply = CursorPaginatedResponse<VideoSchema>;

export const listVideosHandler = async (
  req: FastifyRequest<{
    Querystring: VideosParams;
    Reply: ListVideosReply;
  }>,
  reply: FastifyReply<{ Reply: ListVideosReply }>,
) => {
  const parsed = videosParamsSchema.safeParse(req.query);
  if (!parsed.success) {
    return reply.status(400).send(createErrorMessage(parsed.error.message));
  }

  try {
    const videos = await listVideos(parsed.data);

    // Remove the last element as it was only used for checking if there's more elements
    // Otherwise we do not have a next page
    const items = videos.slice(0, parsed.data.limit);
    const newNextPageToken = videos.length > parsed.data.limit ? items.at(-1)?.id.toString() : undefined;

    reply.send(
      createSuccessMessage(items.map(videoFromEntity), {
        nextPageToken: newNextPageToken,
      }),
    );
  } catch {
    return reply.status(500).send(createErrorMessage("Failed to fetch videos"));
  }
};
