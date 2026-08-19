import "express-serve-static-core";
import { ClientSession, Types } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    userId: Types.ObjectId;
    userEmail: string;
    userRole: string;
    session?: ClientSession;
  }
}
