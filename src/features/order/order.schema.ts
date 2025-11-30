import { InstalmentMonths } from "@/features/instalmentRequest/instalmentRequest.types";
import {
  IOrder,
  OrderDeliveryMethod,
  OrderPaymentMethod,
  OrderStatus,
} from "@/features/order/order.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guest: {
      name: { type: String },
      surname: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
    },
    code: { type: String, required: true, unique: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        salePercent: { type: Number, required: true },
        cashbackPercent: { type: Number, required: true },
      },
    ],
    price: { type: Number, required: true },
    saleApplied: { type: Number, required: true },
    cashbackPayment: { type: Number, required: true },
    netPrice: { type: Number, required: true },
    cashbackEarned: { type: Number, required: true },
    delivery: {
      method: {
        type: String,
        enum: [...Object.values(OrderDeliveryMethod)],
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          required: false,
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: false,
        },
      },
      address: { type: String },
    },
    payment: {
      method: {
        type: String,
        enum: [...Object.values(OrderPaymentMethod)],
        required: true,
      },
      instalmentId: { type: String },
    },
    status: {
      type: String,
      enum: [...Object.values(OrderStatus)],
      default: OrderStatus.PENDING,
    },
    statusChangedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    statusChangedAt: { type: Date },
  },
  { timestamps: true },
);

export const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  orderSchema,
);

export const validateCreateOrder = (data: Partial<IOrder>) => {
  const schema = Joi.object({
    // must fields
    delivery: Joi.object({
      method: Joi.string()
        .valid(...Object.values(OrderDeliveryMethod))
        .required(),
      location: Joi.object({
        type: Joi.string().valid("Point").default("Point"),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
      })
        .optional()
        .allow(null),
      address: Joi.string().optional().allow(null, ""),
    })
      .or("location", "address")
      .required(),
    payment: Joi.object({
      method: Joi.string()
        .valid(...Object.values(OrderPaymentMethod))
        .required(),
      instalmentMonths: Joi.when("method", {
        is: OrderPaymentMethod.INSTALMENTS,
        then: Joi.number()
          .valid(...Object.values(InstalmentMonths))
          .required(),
        otherwise: Joi.forbidden(),
      }),
      instalmentFin: Joi.when("method", {
        is: OrderPaymentMethod.INSTALMENTS,
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
    }).required(),
    cashbackPayment: Joi.boolean().required(),
    // guest fields
    guest: Joi.object({
      name: Joi.string().required(),
      surname: Joi.string(),
      email: Joi.string().email(),
      phoneNumber: Joi.string().required(),
    }).optional(),
    cart: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      }),
    ),
  });

  return schema.validate(data);
};

export const validateUpdateOrderStatus = (data: Partial<IOrder>) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(...Object.values(OrderStatus))
      .required(),
  });

  return schema.validate(data);
};
