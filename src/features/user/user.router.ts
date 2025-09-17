import {
  getUserConfig,
  loginUser,
  registerUser,
  verifyUser,
} from "@/features/user/user.controller";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const userRouter = Router();

userRouter.post("/", errorHandler(registerUser));
userRouter.post("/login", errorHandler(loginUser));
userRouter.get("/config", errorHandler(getUserConfig));
userRouter.get("/verify", errorHandler(verifyUser));
