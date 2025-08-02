import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateVideoSchema, VideoSchema } from "@/shared";
import { videoApi } from "./videoApi";

export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<VideoSchema, Error, CreateVideoSchema>({
    mutationFn: videoApi.createVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
