import {
  createProduct,
  deleteProduct,
  editProduct,
  getProductConfig,
  getProducts,
  getProductTitles,
  getSingleProduct,
} from "@/features/product/product.controller";
import { upload, UploadField } from "@/shared/middlewares/multer.middleware";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { verifyJwtOptional } from "@/shared/middlewares/verifyJwtOptional.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const productRouter = Router();

const productImageLimit = 5;

productRouter.get("/config", errorHandler(getProductConfig));
productRouter.get("/", verifyJwtOptional, errorHandler(getProducts));
productRouter.get("/titles", verifyJwtOptional, errorHandler(getProductTitles));
productRouter.get("/:id", errorHandler(getSingleProduct));
productRouter.post(
  "/",
  verifyJwt,
  verifyAdmin,
  upload.array(UploadField.ProductImage, productImageLimit),
  errorHandler(createProduct),
);
productRouter.patch(
  "/:id",
  verifyJwt,
  verifyAdmin,
  upload.array(UploadField.ProductImage, productImageLimit),
  errorHandler(editProduct),
);
productRouter.delete(
  "/:id",
  verifyJwt,
  verifyAdmin,
  errorHandler(deleteProduct),
);
