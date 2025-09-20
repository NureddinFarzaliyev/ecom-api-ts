import { AuthenticationError } from "@/shared/utils/errorHandler/errors";
import { createErrorResponse } from "@/shared/utils/responseFormatters/createErrorResponse.util";
import { verifyJWTToken } from "@/shared/utils/tokens/jwt.util";
import { NextFunction, Request, Response } from "express";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    const err = new AuthenticationError("No JWT provided");
    const response = createErrorResponse("No JWT provided", err);
    res.status(401).json(response);
    return;
  }

  try {
    const user = verifyJWTToken(token) as {
      id: string;
      email: string;
      role: string;
    };
    req.userId = user.id;
    req.userEmail = user.email;
    req.userRole = user.role;
    next();
  } catch {
    const err = new AuthenticationError("Invalid JWT");
    const response = createErrorResponse("Invalid JWT", err);
    res.status(401).json(response);
  }
};
