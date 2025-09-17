import { ForbiddenError } from "@/shared/utils/errorHandler/errors";
import { createErrorResponse } from "@/shared/utils/responseFormatters/createErrorResponse.util";
import { NextFunction, Request, Response } from "express";

export const verifyCsrf = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = req.cookies["XSRF-TOKEN"];
  const headerToken = req.get("X-CSRF-Token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    const err = new ForbiddenError("Invalid CSRF token");
    const response = createErrorResponse("Invalid CSRF token", err);
    res.status(err.statusCode).json(response);
    return;
  }

  next();
};
