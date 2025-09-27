import mongoose from "mongoose";
import { Request, Response, NextFunction, RequestHandler } from "express";

type TransactionController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any> | void;

export const withTransaction = (
  controller: TransactionController,
): RequestHandler => {
  return async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    req.session = session;
    try {
      await controller(req, res, next);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  };
};
