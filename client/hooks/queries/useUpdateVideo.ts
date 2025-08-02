import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateVideoSchema, VideoSchema } from "@/shared";
import { videoApi } from "./videoApi";

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<VideoSchema, Error, { id: number; data: UpdateVideoSchema }>({
    mutationFn: ({ id, data }) => videoApi.updateVideo(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["video", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
