import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { ParsedQs } from "qs";

export const extractPaginationQueries = (
  query: ParsedQs,
  skipSanitize: boolean = false,
): {
  queryPage: number;
  queryLimit: number;
} => {
  const queryParams = skipSanitize ? query : sanitizeObject(query);

  const response = {
    queryPage: 1,
    queryLimit: 20,
  };

  const page = Number(queryParams.page);
  if (Number.isFinite(page) && page > 0) {
    response.queryPage = page;
  }

  const limit = Number(queryParams.limit);
  if (Number.isFinite(limit) && Number(limit) > 0 && Number(limit) < 50) {
    response.queryLimit = limit;
  }

  return response;
};
