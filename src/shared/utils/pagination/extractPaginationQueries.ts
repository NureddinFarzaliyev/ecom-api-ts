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

  const page = queryParams.page;
  if (Number.isFinite(page) && page > 0) {
    response.queryPage = page;
  }

  const limit = queryParams.limit;
  if (Number.isFinite(limit) && limit > 0 && limit < 50) {
    response.queryLimit = limit;
  }

  return response;
};
