import type { CreateVideoSchema, PaginatedResponse, UpdateVideoSchema, VideoSchema, VideosParams } from "@/shared";

const basename = "localhost:3001";

const apiFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.errors?.[0] || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

const buildVideosQueryParams = (params: VideosParams): string => {
  const queryParams = new URLSearchParams();

  if (params.limit) {
    queryParams.set("limit", String(params.limit));
  }
  if (params.search) {
    queryParams.set("search", params.search);
  }
  if (params.tags) {
    queryParams.set("tags", params.tags);
  }
  if (params.sort) {
    queryParams.set("sort", params.sort);
  }
  if (params.order) {
    queryParams.set("order", params.order);
  }
  if (params.nextPageToken) {
    queryParams.set("nextPageToken", params.nextPageToken);
  }

  return queryParams.toString();
};

export const videoApi = {
  fetchVideos: async (pageParams: VideosParams): Promise<PaginatedResponse<VideoSchema>> => {
    const url = new URL(`http://${basename}/videos`);
    url.search = buildVideosQueryParams(pageParams);

    return apiFetch<PaginatedResponse<VideoSchema>>(url.toString());
  },

  fetchVideo: async (id: number): Promise<VideoSchema> => {
    const url = `http://${basename}/videos/${id}`;
    return apiFetch<VideoSchema>(url);
  },

  createVideo: async (data: CreateVideoSchema): Promise<VideoSchema> => {
    const url = `http://${basename}/videos`;
    return apiFetch<VideoSchema>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateVideo: async (id: number, data: UpdateVideoSchema): Promise<VideoSchema> => {
    const url = `http://${basename}/videos/${id}`;
    return apiFetch<VideoSchema>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteVideo: async (id: number): Promise<void> => {
    const url = `http://${basename}/videos/${id}`;
    return apiFetch<void>(url, {
      method: "DELETE",
    });
  },
};
