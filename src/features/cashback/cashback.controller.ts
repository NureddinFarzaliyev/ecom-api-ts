import { Cashback } from "@/features/cashback/cashback.schema";
import { calculateTotalCashback } from "@/features/cashback/utils/calculateTotalCashback.util";
import { extractPaginationQueries } from "@/shared/utils/pagination/extractPaginationQueries";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { Request, Response } from "express";

export const getCashbacks = async (req: Request, res: Response) => {
  const { userId } = req;
  const { queryLimit, queryPage } = extractPaginationQueries(req.query);

  const findQuery: any = { userId };
  const { results: cashbacks, paginationData } = await paginate(
    Cashback,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
    },
  );

  const totalCashback = calculateTotalCashback(cashbacks);

  const response = createSuccessResponse(
    "Cashback fetched successfully",
    cashbacks,
    { paginationData, totalCashback },
  );
  return res.status(200).json(response);
};
