import { z } from "zod";

export const videosParamsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  tags: z.string().optional(), // comma separated list
  sort: z.enum(["created_at", "duration", "title", "id", "views"]).default("id").optional(),
  order: z.enum(["asc", "desc"]).default("asc").optional(),
  nextPageToken: z.string().optional(),
});

export type VideosParams = z.infer<typeof videosParamsSchema>;

export const videoParamsSchema = z.object({
  id: z.coerce.number().int().positive().min(1),
});

export type VideoParams = z.infer<typeof videoParamsSchema>;
