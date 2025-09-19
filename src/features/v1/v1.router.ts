import { productRouter } from "@/features/product/product.router";
import { productCategoryRouter } from "@/features/productCategory/productCategory.router";
import { userRouter } from "@/features/user/user.router";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { Router } from "express";

export const v1Router = Router();

v1Router.get("/", (_, res) => {
  const response = createSuccessResponse("API V1");
  res.status(200).json(response);
});

v1Router.use("/users", userRouter);
v1Router.use("/product-categories", productCategoryRouter);
v1Router.use("/products", productRouter);
