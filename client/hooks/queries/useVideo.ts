import { useQuery } from "@tanstack/react-query";
import type { VideoSchema } from "@/shared";
import { videoApi } from "./videoApi";

export const useVideo = (id: number) => {
  return useQuery<VideoSchema, Error>({
    queryKey: ["video", id],
    queryFn: () => videoApi.fetchVideo(id),
    enabled: !!id,
  });
};
