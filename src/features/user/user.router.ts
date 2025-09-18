import {
  getMe,
  getUserConfig,
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "@/features/user/user.controller";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const userRouter = Router();

userRouter.post("/", errorHandler(registerUser));
userRouter.post("/login", errorHandler(loginUser));
userRouter.get("/config", errorHandler(getUserConfig));
userRouter.get("/verify", errorHandler(verifyUser));
userRouter.get("/logout", errorHandler(logoutUser));
userRouter.get("/me", verifyJwt, errorHandler(getMe));
