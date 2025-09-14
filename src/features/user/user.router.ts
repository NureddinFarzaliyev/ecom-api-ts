import { getUser } from "@/features/user/user.controller";
import { Router } from "express";

export const userRouter = Router();

userRouter.get("/", getUser);
