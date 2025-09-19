import { IWishlist } from "@/features/wishlist/wishlist.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
    ],
  },
  { timestamps: true },
);

export const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>(
  "Wishlist",
  wishlistSchema,
);

export const validateInitializeWishlist = (wishlist: IWishlist) => {
  const schema = Joi.object({
    userId: Joi.string().hex().length(24).required(),
    products: Joi.array().items(Joi.string()).default([]),
  });
  return schema.validate(wishlist);
};

export const validateAddToWishlist = (body: string | string[]) => {
  const schema = Joi.object({
    productId: Joi.alternatives()
      .try(Joi.string(), Joi.array().items(Joi.string()))
      .required(),
  });
  return schema.validate(body);
};
