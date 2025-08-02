import { z } from "zod";

export const videoSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string(),
  duration: z.coerce.number().int().positive(),
  thumbnail_url: z.string(),
  views: z.number(),
  tags: z.array(z.string()).optional(),
  created_at: z.string(),
});

export type VideoSchema = z.infer<typeof videoSchema>;

export const createVideoSchema = z.object({
  title: z.string().min(1),
  duration: z.number().int().min(1),
  thumbnail_url: z.string().min(1),
  views: z.number().positive().default(0),
  tags: z.array(z.string()).optional(),
});

export type CreateVideoSchema = z.infer<typeof createVideoSchema>;

export const updateVideoSchema = z.object({
  title: z.string().min(1).optional(),
  duration: z.number().int().min(1).optional(),
  thumbnail_url: z.string().min(1).optional(),
  views: z.number().positive().default(0).optional(),
  tags: z.array(z.string()).optional(),
});

export type UpdateVideoSchema = z.infer<typeof updateVideoSchema>;
