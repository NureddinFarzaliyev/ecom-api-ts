import { verifyJWTToken } from "@/shared/utils/tokens/jwt.util";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

export const verifyJwtOptional = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.jwt;

  if (!token) {
    next();
    return;
  }

  try {
    const user = verifyJWTToken(token) as {
      id: Types.ObjectId;
      email: string;
      role: string;
    };
    req.userId = user.id;
    req.userEmail = user.email;
    req.userRole = user.role;
    next();
  } catch {
    next();
  }
};
