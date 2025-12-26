import { IProduct, ProductQueries } from "@/features/product/product.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },
    price: { type: Number, required: true },
    salePercent: { type: Number, default: 0 },
    cashbackPercent: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema,
);

export const validateCreateProduct = (data: Partial<IProduct>) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required().max(2000),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    salePercent: Joi.number().min(0).max(100).default(0),
    cashbackPercent: Joi.number().min(0).max(100).default(0),
    stock: Joi.number().min(0).required(),
    isPublic: Joi.boolean().default(true),
  });

  return schema.validate(data);
};

export const validateEditProduct = (data: Partial<IProduct>) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string().max(2000),
    category: Joi.string(),
    price: Joi.number().min(0),
    salePercent: Joi.number().min(0).max(100).default(0),
    cashbackPercent: Joi.number().min(0).max(100).default(0),
    stock: Joi.number().min(0),
    keepImages: Joi.string(),
    isPublic: Joi.boolean(),
  });

  return schema.validate(data);
};
