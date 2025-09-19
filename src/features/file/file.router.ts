import { getFileController } from "@/features/file/file.controller";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const fileRouter = Router();

fileRouter.get("/:folder/:filename", errorHandler(getFileController));
