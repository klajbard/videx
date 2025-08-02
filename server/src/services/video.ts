import type { Prisma, Video } from "@prisma/client";
import { prismaClient } from "@/prisma";
import { type CreateVideoSchema, tagsToString, type UpdateVideoSchema, type VideosParams } from "@/shared";

export const createVideo = ({ title, tags, duration, thumbnail_url, views }: CreateVideoSchema): Promise<Video> =>
  prismaClient.video.create({
    data: {
      title,
      tags: tags ? tagsToString(tags) : "",
      duration,
      thumbnail_url,
      views,
    },
  });

export const deleteVideo = (id: number): Promise<Video> => prismaClient.video.delete({ where: { id } });

export const getVideo = (id: number): Promise<Video | null> => prismaClient.video.findUnique({ where: { id } });

export const updateVideo = (id: number, data: UpdateVideoSchema): Promise<Video> => {
  const update: Prisma.VideoUpdateInput = {};

  if (data.title) {
    update.title = data.title;
  }

  if (data.tags) {
    update.tags = tagsToString(data.tags);
  }

  if (data.duration) {
    update.duration = data.duration;
  }

  if (data.thumbnail_url) {
    update.thumbnail_url = data.thumbnail_url;
  }

  if (data.views) {
    update.views = data.views;
  }

  return prismaClient.video.update({ where: { id }, data: update });
};

export const listVideos = ({
  limit = 10,
  search,
  tags,
  sort,
  order,
  nextPageToken,
}: VideosParams): Promise<Video[]> => {
  const select: Prisma.SelectSubset<Prisma.VideoFindManyArgs, Prisma.VideoFindManyArgs> = {};
  const where: Prisma.VideoWhereInput = {};

  // Title based filter
  if (search) {
    where.title = { contains: search };
  }

  // Tags based filter
  if (tags) {
    const tagList = tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean);
    if (tagList.length > 0) {
      where.OR = tagList.map((tag: string) => ({ tags: { contains: tag } }));
    }
  }

  select.where = where;

  // Pagination
  if (nextPageToken) {
    select.cursor = {
      id: parseInt(nextPageToken),
    };
    select.skip = 1;
  }

  // Sorting
  if (sort) {
    select.orderBy = { [sort]: order || "asc" };
  }

  // Take additional element so we can see if we could have a next page
  select.take = limit + 1;

  return prismaClient.video.findMany(select);
};
