import {
  deleteNotificationInput,
  INotification,
  NotificationType,
  readNotificationInput,
} from "@/features/notification/notification.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: [...Object.values(NotificationType)],
      default: NotificationType.INFO,
    },
  },
  { timestamps: true },
);

export const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);

export const validateCreateNotification = (
  notification: Partial<INotification>,
) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(NotificationType))
      .required()
      .default(NotificationType.INFO),
  });

  return schema.validate(notification);
};

export const validateReadNotification = (data: readNotificationInput) => {
  const schema = Joi.object({
    notifications: Joi.array().items(Joi.string()).required(),
  });

  return schema.validate(data);
};

export const validateDeleteNotification = (data: deleteNotificationInput) => {
  return validateReadNotification(data);
};
