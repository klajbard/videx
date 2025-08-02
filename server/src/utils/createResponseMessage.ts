import type { ErrorResponse, OkResponse } from "@/shared";

export const createErrorMessage = (message: string | string[]): ErrorResponse => ({
  status: "error",
  errors: Array.isArray(message) ? message : [message],
});

export const createSuccessMessage = <T = unknown>(data: T, rest?: Record<string, unknown>): OkResponse<T> => ({
  status: "ok",
  data,
  ...rest,
});
