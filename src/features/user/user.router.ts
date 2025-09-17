import {
  getUserConfig,
  registerUser,
  verifyUser,
} from "@/features/user/user.controller";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const userRouter = Router();

userRouter.get("/config", errorHandler(getUserConfig));
userRouter.get("/verify", errorHandler(verifyUser));
userRouter.post("/", errorHandler(registerUser));
