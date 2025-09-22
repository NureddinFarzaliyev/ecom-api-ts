import {
  Notification,
  validateDeleteNotification,
  validateReadNotification,
} from "@/features/notification/notification.schema";
import {
  deleteNotificationInput,
  NotificationType,
  readNotificationInput,
} from "@/features/notification/notification.types";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const getNotificationConfig = async (_req: Request, res: Response) => {
  const config = {
    NotificationType,
  };

  const response = createSuccessResponse(
    "Notification config fetched successfully",
    config,
  );
  return res.status(200).json(response);
};

export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req;

  const findQuery: any = { userId };

  const queryParams = sanitizeObject(req.query);
  const queryPage = queryParams.page || 1;
  const queryLimit = queryParams.limit || 10;

  const { results: notifications, paginationData } = await paginate(
    Notification,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
    },
  );

  const response = createSuccessResponse(
    "notifications fetched successfully",
    notifications,
    { paginationData },
  );
  return res.status(200).json(response);
};

export const readNotification = async (req: Request, res: Response) => {
  const { userId } = req;
  const body = sanitizeObject(req.body);
  const { error } = validateReadNotification(body as readNotificationInput);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const notifs = await Notification.updateMany(
    { _id: { $in: body.notifications }, userId },
    { $set: { isRead: true } },
  );

  const response = createSuccessResponse(
    "notifications marked as read successfully",
    notifs,
  );
  return res.status(200).json(response);
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { userId } = req;
  const body = sanitizeObject(req.body);
  const { error } = validateDeleteNotification(body as deleteNotificationInput);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const notifs = await Notification.deleteMany({
    _id: { $in: body.notifications },
    userId,
  });

  const response = createSuccessResponse(
    "notifications deleted successfully",
    notifs,
  );
  return res.status(200).json(response);
};
