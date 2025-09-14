import { Router } from "express";

export const userRouter = Router();

userRouter.get("/", (_, res) => {
  res.send("User route is working!");
});
