import { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "@/shared/utils/errorHandler/errors";
import { createErrorResponse } from "@/shared/utils/responseFormatters/createErrorResponse.util";
import { logger } from "@/shared/tools/logger";
import { cleanupFilesInRequest } from "@/shared/utils/files/cleanupFilesInRequest";

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

      await cleanupFilesInRequest(req);

      // mongodb errors
      if (error.message && error.message.includes("E11000")) {
        const errorResponse = createErrorResponse("Duplicate Key Error", error);
        res.status(400).json(errorResponse);
        return;
      }

      if (error.message && error.message.includes("Cast to ObjectId failed")) {
        const errorResponse = createErrorResponse("Invalid ID Format", error);
        res.status(400).json(errorResponse);
        return;
      }

      // Custom App Errors
      if (error instanceof AppError) {
        const errorResponse = createErrorResponse(error.message, error);
        res.status(error.statusCode).json(errorResponse);
      } else {
        // Other unhandled errors
        const errorResponse = createErrorResponse(
          "Internal Server Error",
          error,
        );
        res.status(500).json(errorResponse);
      }
    }
  };
};
