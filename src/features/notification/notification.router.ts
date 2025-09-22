import {
  deleteNotification,
  getNotificationConfig,
  getNotifications,
  readNotification,
} from "@/features/notification/notification.controller";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const notificationRouter = Router();

notificationRouter.get("/config", errorHandler(getNotificationConfig));
notificationRouter.get("/", verifyJwt, errorHandler(getNotifications));
notificationRouter.patch("/", verifyJwt, errorHandler(readNotification));
notificationRouter.delete("/", verifyJwt, errorHandler(deleteNotification));
