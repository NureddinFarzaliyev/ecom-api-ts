import { Document } from "mongoose";

export enum NotificationType {
  INFO = "info",
  WARN = "warn",
  FAIL = "fail",
  SUCCESS = "success",
  PROMO = "promo",
}

export interface INotification extends Document {
  userId: string;
  title: string;
  content: string;
  isRead: boolean;
  type: NotificationType;
}

export interface readNotificationInput {
  notifications: string[];
}

export interface deleteNotificationInput extends readNotificationInput { }
