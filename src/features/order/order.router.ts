import {
  changeOrderStatus,
  createOrder,
  getOrders,
  getSingleOrder,
} from "@/features/order/order.controller";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { verifyJwtOptional } from "@/shared/middlewares/verifyJwtOptional.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { withTransaction } from "@/shared/utils/withTransaction/withTransaction.utils";
import { Router } from "express";

export const orderRouter = Router();

orderRouter.get("/", verifyJwt, errorHandler(getOrders));
orderRouter.get("/:id", verifyJwt, errorHandler(getSingleOrder));
orderRouter.post(
  "/",
  verifyJwtOptional,
  errorHandler(withTransaction(createOrder)),
);
orderRouter.patch(
  "/:id/status",
  verifyJwt,
  verifyAdmin,
  errorHandler(changeOrderStatus),
);
