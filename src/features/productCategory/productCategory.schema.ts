import { IProductCategory } from "@/features/productCategory/productCategory.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const productCategorySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    default: null,
  },
});

export const ProductCategory: Model<IProductCategory> =
  mongoose.model<IProductCategory>("ProductCategory", productCategorySchema);

export const validateCreateProductCategory = (
  productCategory: Partial<IProductCategory>,
) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    parentId: Joi.string(),
  });

  return schema.validate(productCategory);
};

export const validateEditProductCategory = (
  productCategory: Partial<IProductCategory>,
) => {
  const schema = Joi.object({
    title: Joi.string(),
    parentId: Joi.string().allow(null),
  });

  return schema.validate(productCategory);
};
