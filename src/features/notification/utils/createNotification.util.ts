import {
  Notification,
  validateCreateNotification,
} from "@/features/notification/notification.schema";
import { INotification } from "@/features/notification/notification.types";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";

export const createNotification = async (
  notification: Partial<Omit<INotification, "isRead">>,
) => {
  const body = sanitizeObject(notification);
  const { error } = validateCreateNotification(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const newNotification = new Notification(body);
  const result = await newNotification.save();
  return result;
};
