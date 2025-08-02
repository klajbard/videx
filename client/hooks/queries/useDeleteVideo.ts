import { useMutation, useQueryClient } from "@tanstack/react-query";
import { videoApi } from "./videoApi";

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: videoApi.deleteVideo,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ["video", deletedId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
