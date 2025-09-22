import { ICashback } from "@/features/cashback/cashback.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const cashbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Cashback: Model<ICashback> = mongoose.model<ICashback>(
  "Cashback",
  cashbackSchema,
);

export const validateCreateCashback = (cashback: Partial<ICashback>) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().required(),
  });

  return schema.validate(cashback);
};
