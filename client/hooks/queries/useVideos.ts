import { useInfiniteQuery } from "@tanstack/react-query";
import type { VideosParams } from "@/shared";
import { videoApi } from "./videoApi";

export const useVideos = (initialParams: VideosParams = { limit: 10 }) => {
  return useInfiniteQuery({
    queryKey: ["videos", initialParams] as const,
    initialPageParam: initialParams,
    queryFn: ({ pageParam }) => videoApi.fetchVideos(pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextPageToken) {
        return undefined;
      }
      return {
        ...initialParams,
        nextPageToken: lastPage.nextPageToken,
      };
    },
  });
};
