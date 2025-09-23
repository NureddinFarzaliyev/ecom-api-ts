import { Cashback } from "@/features/cashback/cashback.schema";
import { calculateTotalCashback } from "@/features/cashback/utils/calculateTotalCashback.util";

export const calculateUserCashback = async (userId: string) => {
  const cashbacks = await Cashback.find({ userId });
  return calculateTotalCashback(cashbacks);
};
