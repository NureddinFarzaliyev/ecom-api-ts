import { userRouter } from "@/features/user/user.router";
import { createResponseJSON } from "@/shared/utils/createResponseJSON/createResponseJSON.util";
import { Router } from "express";

export const v1Router = Router();

v1Router.get("/", (_, res) => {
  const response = createResponseJSON(true, "API V1");
  res.status(200).json(response);
});

v1Router.use("/users", userRouter);
