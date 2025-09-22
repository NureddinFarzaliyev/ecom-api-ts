import { Cashback } from "@/features/cashback/cashback.schema";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const getCashbacks = async (req: Request, res: Response) => {
  const { userId } = req;

  const findQuery: any = { userId };

  const queryParams = sanitizeObject(req.query);
  const queryPage = queryParams.page || 1;
  const queryLimit = queryParams.limit || 10;

  const { results: cashbacks, paginationData } = await paginate(
    Cashback,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
    },
  );

  const response = createSuccessResponse(
    "Cashback fetched successfully",
    cashbacks,
    { paginationData },
  );
  return res.status(200).json(response);
};
