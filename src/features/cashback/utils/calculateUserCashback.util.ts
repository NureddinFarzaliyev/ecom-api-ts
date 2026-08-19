import { Cashback } from "@/features/cashback/cashback.schema";
import { calculateTotalCashback } from "@/features/cashback/utils/calculateTotalCashback.util";
import { Types } from "mongoose";

export const calculateUserCashback = async (userId: Types.ObjectId) => {
  const cashbacks = await Cashback.find({ userId });
  return calculateTotalCashback(cashbacks);
};
