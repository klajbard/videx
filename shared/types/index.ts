import type { VideoSchema } from "../schemas";

export interface ErrorResponse {
  status: "error";
  errors: string[];
}

export type OkResponse<T = VideoSchema, U = unknown> = {
  status: "ok";
  data: T;
} & U;

export type Response<T = VideoSchema, U = unknown> = OkResponse<T, U> | ErrorResponse;

export interface CursorPaginationMetadata {
  nextPageToken?: string;
}

export type PaginatedResponse<T = VideoSchema> = OkResponse<T[], CursorPaginationMetadata>;

export type CursorPaginatedResponse<T = VideoSchema> = OkResponse<T[], CursorPaginationMetadata> | ErrorResponse;
