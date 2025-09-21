import {
  createCustomOrder,
  createCustomOrderOffer,
  deleteCustomOrder,
  editCustomOrder,
  getCustomOrders,
  getCustomOrdersConfig,
  getSingleCustomOrder,
  resolveCustomOrder,
  respondCustomOrderOffer,
} from "@/features/customOrder/customOrder.controller";
import { upload, UploadField } from "@/shared/middlewares/multer.middleware";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { verifyJwtOptional } from "@/shared/middlewares/verifyJwtOptional.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const customOrderRouter = Router();

customOrderRouter.get("/", verifyJwt, errorHandler(getCustomOrders));
customOrderRouter.get("/config", errorHandler(getCustomOrdersConfig));
customOrderRouter.get("/:id", verifyJwt, errorHandler(getSingleCustomOrder));
customOrderRouter.delete("/:id", verifyJwt, errorHandler(deleteCustomOrder));
customOrderRouter.post(
  "/",
  upload.array(UploadField.CustomOrderImage, 5),
  verifyJwtOptional,
  errorHandler(createCustomOrder),
);
customOrderRouter.post(
  "/:id/offer",
  verifyJwt,
  verifyAdmin,
  errorHandler(createCustomOrderOffer),
);
customOrderRouter.post(
  "/:id/response",
  verifyJwt,
  errorHandler(respondCustomOrderOffer),
);
customOrderRouter.post(
  "/:id/resolve",
  verifyJwt,
  verifyAdmin,
  errorHandler(resolveCustomOrder),
);
customOrderRouter.patch(
  "/:id",
  verifyJwt,
  upload.array(UploadField.CustomOrderImage, 5),
  errorHandler(editCustomOrder),
);
