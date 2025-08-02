import { faker } from "@faker-js/faker";
import type { Video } from "@prisma/client";

export const createVideoData = (override: Partial<Video> = {}): Video => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  title: faker.lorem.sentence({ min: 1, max: 6 }),
  tags: faker.helpers.multiple(faker.book.genre, { count: { min: 1, max: 3 } }).join(","),
  created_at: faker.date.past(),
  duration: faker.number.int({ min: 4_000, max: 24_000 }),
  views: faker.number.int({ min: 1, max: 5_000 }),
  thumbnail_url: faker.image.avatar(),
  ...override,
});

export const createVideosData = (length: number): Video[] => {
  return Array.from({ length }).map(() => createVideoData());
};
