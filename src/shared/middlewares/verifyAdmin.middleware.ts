import { UserRole } from "@/features/user/user.types";
import { ForbiddenError } from "@/shared/utils/errorHandler/errors";
import { createErrorResponse } from "@/shared/utils/responseFormatters/createErrorResponse.util";
import { NextFunction, Request, Response } from "express";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.userRole !== UserRole.ADMIN) {
    const err = new ForbiddenError("Forbidden");
    const response = createErrorResponse("Forbidden", err);
    res.status(403).json(response);
    return;
  }
  next();
};
