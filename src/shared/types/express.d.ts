import "express-serve-static-core";
import { ClientSession } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
    userEmail: string;
    userRole: string;
    session?: ClientSession;
  }
}
