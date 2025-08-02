import type z from "zod";

export const parseZodIssues = (issues: z.core.$ZodIssue[]) =>
  issues.map((issue) => `${issue.path.join(".")} ${issue.message}`.toLowerCase());
