import {
  createSalesCampaign,
  deleteSalesCampaign,
  editSalesCampaign,
  getSalesCampaignConfig,
  getSalesCampaigns,
  getSingleSalesCampaign,
} from "@/features/salesCampaign/salesCampaign.controller";
import { upload, UploadField } from "@/shared/middlewares/multer.middleware";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const salesCampaignRouter = Router();

salesCampaignRouter.get("/", errorHandler(getSalesCampaigns));
salesCampaignRouter.get("/config", errorHandler(getSalesCampaignConfig));
salesCampaignRouter.get("/:id", errorHandler(getSingleSalesCampaign));
salesCampaignRouter.post(
  "/",
  verifyJwt,
  verifyAdmin,
  upload.single(UploadField.SalesCampaignImage),
  errorHandler(createSalesCampaign),
);
salesCampaignRouter.patch(
  "/:id",
  verifyJwt,
  verifyAdmin,
  upload.single(UploadField.SalesCampaignImage),
  errorHandler(editSalesCampaign),
);
salesCampaignRouter.delete(
  "/:id",
  verifyJwt,
  verifyAdmin,
  errorHandler(deleteSalesCampaign),
);
