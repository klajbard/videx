import { useState } from "react";
import type { VideosParams } from "@/shared";

export type SortBy =
  | "created_at"
  | "created_at_desc"
  | "duration"
  | "duration_desc"
  | "title"
  | "title_desc"
  | "id"
  | "views"
  | "views_desc";

export const useSortBy = () => {
  const [sortBy, setSortBy] = useState<SortBy>("id");

  return { sortBy, setSortBy };
};

export const sortByOptions: Record<SortBy, string> = {
  id: "Default",
  created_at_desc: "Newest first",
  created_at: "Oldest first",
  duration_desc: "Longest first",
  duration: "Shortest first",
  title: "Title ascending",
  title_desc: "Title descending",
  views: "Most views",
  views_desc: "Least views",
};

export const getFilterParams = (sortBy: SortBy, search: string): VideosParams => {
  const params: VideosParams = {
    limit: 10,
  };
  switch (sortBy) {
    case "created_at":
      params.sort = "created_at";
      params.order = "asc";
      break;
    case "created_at_desc":
      params.sort = "created_at";
      params.order = "desc";
      break;
    case "duration":
      params.sort = "duration";
      params.order = "asc";
      break;
    case "duration_desc":
      params.sort = "duration";
      params.order = "desc";
      break;
    case "title":
      params.sort = "title";
      params.order = "asc";
      break;
    case "title_desc":
      params.sort = "title";
      params.order = "desc";
      break;
    case "id":
      params.sort = "id";
      params.order = "asc";
      break;
    case "views":
      params.sort = "views";
      params.order = "asc";
      break;
    case "views_desc":
      params.sort = "views";
      params.order = "desc";
      break;
  }
  if (search) {
    params.search = search;
  }
  return params;
};
