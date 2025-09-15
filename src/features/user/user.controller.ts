import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { Request, Response } from "express";

export const getUser = errorHandler(async (_req: Request, res: Response) => {
  const response = createSuccessResponse("User Route is functional");
  res.status(200).json(response);
});
