import {
  Cashback,
  validateCreateCashback,
} from "@/features/cashback/cashback.schema";
import { NotificationType } from "@/features/notification/notification.types";
import { createNotification } from "@/features/notification/utils/createNotification.util";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
import { ClientSession } from "mongoose";

export const createCashback = async (
  userId: string,
  amount: number,
  notification: string | null = null,
  session: ClientSession | null = null,
) => {
  const { error } = validateCreateCashback({ userId, amount });
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (notification) {
    createNotification({
      userId,
      title: "Cashback",
      content: notification,
      type: NotificationType.INFO,
    });
  }

  const cashback = new Cashback({ userId, amount });
  const result = await cashback.save({ session });
  return result;
};
