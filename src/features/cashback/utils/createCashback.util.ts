import {
  Cashback,
  validateCreateCashback,
} from "@/features/cashback/cashback.schema";
import { ValidationError } from "@/shared/utils/errorHandler/errors";

export const createCashback = async (userId: string, amount: number) => {
  const { error } = validateCreateCashback({ userId, amount });
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const cashback = new Cashback({ userId, amount });
  const result = await cashback.save();
  return result;
};
