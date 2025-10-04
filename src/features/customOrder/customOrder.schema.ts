import {
  CustomOrderOffer,
  customOrderOfferResponse,
  CustomOrderOfferResponseStatus,
  CustomOrderOfferStatus,
  customOrderResolve,
  CustomOrderStatus,
  ICustomOrder,
} from "@/features/customOrder/customOrder.types";
import { parseStringJSON } from "@/shared/utils/JSONParsers/parseStringJSON.util";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const customOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    code: { type: String, required: true, unique: true },
    guest: {
      name: { type: String },
      surname: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
    },
    content: { type: String, required: true },
    link: { type: String },
    images: [{ type: String }],
    status: {
      type: String,
      enum: [...Object.values(CustomOrderStatus)],
      default: CustomOrderStatus.PENDING,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: { type: Date },
    offers: [
      {
        price: { type: Number, required: true },
        message: { type: String },
        rejectReason: { type: String },
        status: {
          type: String,
          enum: [...Object.values(CustomOrderOfferStatus)],
          default: CustomOrderOfferStatus.PENDING,
        },
        date: { type: Date, default: Date.now },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

export const CustomOrder: Model<ICustomOrder> = mongoose.model<ICustomOrder>(
  "CustomOrder",
  customOrderSchema,
);

export const validateCreateCustomOrder = (order: Partial<ICustomOrder>) => {
  let parserOrder = { ...order };
  parserOrder.guest = parseStringJSON(order.guest);

  const schema = Joi.object({
    guest: Joi.object({
      name: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
    }).when("userId", {
      is: null,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    }),
    content: Joi.string().required(),
    link: Joi.string().optional().allow(""),
  });

  return schema.validate(parserOrder);
};

export const validateEditCustomOrder = (order: Partial<ICustomOrder>) => {
  const schema = Joi.object({
    content: Joi.string(),
    link: Joi.string(),
  });

  return schema.validate(order);
};

export const validateCreateCustomOrderOffer = (offer: CustomOrderOffer) => {
  const schema = Joi.object({
    price: Joi.number().required(),
    message: Joi.string().optional().allow(""),
  });

  return schema.validate(offer);
};

export const validateRespondCustomOrderOffer = (
  response: customOrderOfferResponse,
) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(...Object.values(CustomOrderOfferResponseStatus))
      .required(),
    rejectReason: Joi.string().when("status", {
      is: CustomOrderOfferResponseStatus.REJECTED,
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  });

  return schema.validate(response);
};

export const validateResolveCustomOrder = (status: customOrderResolve) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(CustomOrderStatus.COMPLETED, CustomOrderStatus.CANCELLED)
      .required(),
  });

  return schema.validate(status);
};
