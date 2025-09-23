import { NextFunction, Request, RequestHandler, Response } from "express";
import { ClientSession, startSession } from "mongoose";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
  session: ClientSession,
) => Promise<any> | void;

export const withTransaction = (
  controller: AsyncController,
): RequestHandler => {
  return async (req, res, next) => {
    const session = await startSession();
    session.startTransaction();
    try {
      await controller(req, res, next, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  };
};
