import {
  AddProductsToCartInput,
  ICart,
  RemoveProductsFromCartInput,
} from "@/features/cart/cart.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export const validateInitializeCart = (cart: Partial<ICart>) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
        }),
      )
      .optional(),
  });

  return schema.validate(cart);
};

export const validateAddProductsToCart = (data: AddProductsToCartInput) => {
  const schema = Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
        }),
      )
      .min(1)
      .required(),
  });

  return schema.validate(data);
};

export const validateRemoveProductsFromCart = (
  data: RemoveProductsFromCartInput,
) => {
  return validateAddProductsToCart(data);
};
