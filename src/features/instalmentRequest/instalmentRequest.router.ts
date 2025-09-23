import {
  changeInstalmentRequestStatus,
  getInstalmentRequestConfig,
  getInstalmentRequests,
  getSingleInstalmentRequest,
} from "@/features/instalmentRequest/instalmentRequest.controller";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const instalmentRequestRouter = Router();

instalmentRequestRouter.get(
  "/",
  verifyJwt,
  errorHandler(getInstalmentRequests),
);
instalmentRequestRouter.get(
  "/config",
  errorHandler(getInstalmentRequestConfig),
);
instalmentRequestRouter.get(
  "/:id",
  verifyJwt,
  errorHandler(getSingleInstalmentRequest),
);
instalmentRequestRouter.patch(
  "/:id/status",
  verifyJwt,
  verifyAdmin,
  errorHandler(changeInstalmentRequestStatus),
);
