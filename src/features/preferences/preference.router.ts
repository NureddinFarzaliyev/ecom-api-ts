import {
  getAllPreferences,
  getPreferencesConfig,
  updatePreferences,
} from "@/features/preferences/preference.controller";
import { upload, UploadField } from "@/shared/middlewares/multer.middleware";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { withTransaction } from "@/shared/utils/withTransaction/withTransaction.utils";
import { Router } from "express";

export const preferenceRouter = Router();

preferenceRouter.get("/", errorHandler(getAllPreferences));
preferenceRouter.get("/config", errorHandler(getPreferencesConfig));
preferenceRouter.patch(
  "/",
  verifyJwt,
  verifyAdmin,
  upload.single(UploadField.PreferencesImage),
  withTransaction(errorHandler(updatePreferences)),
);
