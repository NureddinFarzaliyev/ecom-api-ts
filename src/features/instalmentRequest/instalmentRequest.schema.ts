import {
  IInstalmentRequest,
  InstalmentPaymentStatus,
  InstalmentRequestStatus,
} from "@/features/instalmentRequest/instalmentRequest.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const instalmentRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    fin: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    totalPrice: { type: Number, required: true },
    months: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(InstalmentRequestStatus),
      default: InstalmentRequestStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(InstalmentPaymentStatus),
      default: InstalmentPaymentStatus.WAITING,
    },
  },
  { timestamps: true },
);

export const InstalmentRequest: Model<IInstalmentRequest> =
  mongoose.model<IInstalmentRequest>(
    "InstalmentRequest",
    instalmentRequestSchema,
  );

export const validateCreateInstalmentRequest = (
  data: Partial<IInstalmentRequest>,
) => {
  const schema = Joi.object({
    userId: Joi.string(),
    orderId: Joi.string().required(),
    fin: Joi.string().required(),
    totalPrice: Joi.number().required(),
    months: Joi.number().required(),
  });

  return schema.validate(data);
};

export const validateInstalmentRequestStatusUpdate = (
  data: Partial<IInstalmentRequest>,
) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(...Object.values(InstalmentRequestStatus))
      .required(),
  });

  return schema.validate(data);
};
