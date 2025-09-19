import {
  createProduct,
  deleteProduct,
  editProduct,
  getProductConfig,
  getProducts,
  getSingleProduct,
} from "@/features/product/product.controller";
import { upload, UploadField } from "@/shared/middlewares/multer.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const productRouter = Router();

const productImageLimit = 5;

productRouter.get("/config", errorHandler(getProductConfig));
productRouter.get("/", errorHandler(getProducts)); // page and limit as query params
productRouter.get("/:id", errorHandler(getSingleProduct));
productRouter.post(
  "/",
  upload.array(UploadField.ProductImage, productImageLimit),
  errorHandler(createProduct),
);
productRouter.patch(
  "/:id",
  upload.array(UploadField.ProductImage, productImageLimit),
  errorHandler(editProduct),
);
productRouter.delete("/:id", errorHandler(deleteProduct));
