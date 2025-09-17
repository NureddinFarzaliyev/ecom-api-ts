import { AuthenticationError } from "@/shared/utils/errorHandler/errors";
import { createErrorResponse } from "@/shared/utils/responseFormatters/createErrorResponse.util";
import { verifyJWTToken } from "@/shared/utils/tokens/jwt.util";
import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const verifyJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.jwt;

  if (!token) {
    const err = new AuthenticationError("No JWT provided");
    const response = createErrorResponse("No JWT provided", err);
    res.status(401).json(response);
    return;
  }

  try {
    req.user = verifyJWTToken(token) as { id: string; email: string };
    next();
  } catch {
    const err = new AuthenticationError("Invalid JWT");
    const response = createErrorResponse("Invalid JWT", err);
    res.status(401).json(response);
  }
};
