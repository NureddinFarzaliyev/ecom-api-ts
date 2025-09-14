import { userRouter } from "@/features/user/user.router";
import { Router } from "express";

export const v1Router = Router();

v1Router.get("/", (_, res) => {
  res.send("API V1");
});

v1Router.use("/users", userRouter);
