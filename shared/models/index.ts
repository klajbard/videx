import type { Video } from "@prisma/client";
import { type VideoSchema, videoSchema } from "../schemas";

export const videoFromEntity = (video: Video): VideoSchema => {
  return videoSchema.parse({
    title: video.title,
    tags: tagsFromString(video.tags),
    duration: video.duration,
    id: video.id,
    created_at: video.created_at.toISOString(),
    thumbnail_url: video.thumbnail_url,
    views: video.views,
  });
};

export const videoToEntity = (video: VideoSchema): Video => {
  return {
    title: video.title,
    tags: tagsToString(video.tags),
    duration: video.duration,
    id: video.id,
    created_at: new Date(video.created_at),
    thumbnail_url: video.thumbnail_url,
    views: video.views,
  };
};

export const tagsToString = (tags: string[] | undefined): string => tags?.join(",") ?? "";

export const tagsFromString = (tags: string | undefined): string[] =>
  tags !== undefined && tags !== "" ? tags.split(",") : [];
