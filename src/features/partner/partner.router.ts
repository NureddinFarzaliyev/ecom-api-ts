import {
  createPartner,
  deletePartner,
  editPartner,
  getAllPartner,
  getPartnerConfig,
} from "@/features/partner/partner.controller";
import { upload, UploadField } from "@/shared/middlewares/multer.middleware";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { verifyJwtOptional } from "@/shared/middlewares/verifyJwtOptional.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const partnerRouter = Router();

partnerRouter.get("/config", errorHandler(getPartnerConfig));
partnerRouter.get("/", verifyJwtOptional, errorHandler(getAllPartner));
partnerRouter.post(
  "/",
  verifyJwt,
  verifyAdmin,
  upload.single(UploadField.PartnerImage),
  errorHandler(createPartner),
);
partnerRouter.patch(
  "/:id",
  verifyJwt,
  verifyAdmin,
  upload.single(UploadField.PartnerImage),
  errorHandler(editPartner),
);
partnerRouter.delete(
  "/:id",
  verifyJwt,
  verifyAdmin,
  errorHandler(deletePartner),
);
