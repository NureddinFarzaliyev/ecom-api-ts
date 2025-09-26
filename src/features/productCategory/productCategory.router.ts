import {
  createProductCategory,
  deleteProductCategory,
  editProductCategory,
  fetchAllProductCategories,
} from "@/features/productCategory/productCategory.controller";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const productCategoryRouter = Router();

productCategoryRouter.get("/", errorHandler(fetchAllProductCategories));
productCategoryRouter.post(
  "/",
  verifyJwt,
  verifyAdmin,
  errorHandler(createProductCategory),
);
productCategoryRouter.patch(
  "/:id",
  verifyJwt,
  verifyAdmin,
  errorHandler(editProductCategory),
);
productCategoryRouter.delete(
  "/:id",
  verifyJwt,
  verifyAdmin,
  errorHandler(deleteProductCategory),
);
