import { PrismaClient, type Video } from "@prisma/client";
import { videos } from "./videos.json";

const prisma = new PrismaClient();

const transformVideoData = (video: (typeof videos)[0]): Video => {
  const match = video.id.match(/v-(\d+)/);

  if (match === null) {
    throw new Error(`Invalid id: ${video.id}.`);
  }

  return {
    id: parseInt(match[1], 10),
    title: video.title,
    thumbnail_url: video.thumbnail_url,
    created_at: new Date(video.created_at),
    duration: video.duration,
    views: video.views,
    tags: video.tags?.join(",") ?? "",
  };
};

const seedWithFile = async (): Promise<void> => {
  const transformedVideos = videos.map(transformVideoData);

  await prisma.video.deleteMany();
  await prisma.video.createMany({
    data: transformedVideos,
  });

  console.log(`Successfully seeded ${transformedVideos.length} videos`);
};

seedWithFile()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
