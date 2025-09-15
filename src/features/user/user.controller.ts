import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { Request, Response } from "express";

export const getUser = (_req: Request, res: Response) => {
  const response = createSuccessResponse("User Route is functional");
  res.status(200).json(response);
};
