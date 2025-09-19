import {
  getAllPreferences,
  getPreferencesConfig,
  updatePreferences,
} from "@/features/preferences/preference.controller";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const preferenceRouter = Router();

preferenceRouter.get("/", errorHandler(getAllPreferences));
preferenceRouter.get("/config", errorHandler(getPreferencesConfig));
preferenceRouter.patch("/", errorHandler(updatePreferences));
