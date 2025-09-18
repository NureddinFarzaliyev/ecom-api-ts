import {
  createProductCategory,
  deleteProductCategory,
  editProductCategory,
  fetchAllProductCategories,
} from "@/features/productCategory/productCategory.controller";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const productCategoryRouter = Router();

productCategoryRouter.get("/", errorHandler(fetchAllProductCategories));
productCategoryRouter.post("/", errorHandler(createProductCategory));
productCategoryRouter.patch("/:id", errorHandler(editProductCategory));
productCategoryRouter.delete("/:id", errorHandler(deleteProductCategory));
