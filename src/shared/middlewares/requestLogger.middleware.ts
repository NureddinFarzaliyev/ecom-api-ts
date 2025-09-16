import { Request, Response, NextFunction } from "express";
import { logger } from "@/shared/tools/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on("finish", () => {
    logger.http(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
  });
  next();
};
