import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "@/shared/utils/errorHandler/errors";
import { createErrorResponse } from "@/shared/utils/responseFormatters/createErrorResponse.util";
import { logger } from "@/shared/tools/logger";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | void;

export const errorHandler = (controller: AsyncController): RequestHandler => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error: any) {
      logger.error(error);

      if (error instanceof AppError) {
        const errorResponse = createErrorResponse(error.message, error);
        res.status(error.statusCode).json(errorResponse);
      } else {
        const errorResponse = createErrorResponse(
          "Internal Server Error",
          error,
        );
        res.status(500).json(errorResponse);
      }
    }
  };
};
