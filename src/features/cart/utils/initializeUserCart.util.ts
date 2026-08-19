import { Cart } from "@/features/cart/cart.schema";
import { Types } from "mongoose";

export const initializeUserCart = async (
  userId: Types.ObjectId,
  populate: boolean = false,
) => {
  let status = 200;
  let cart = await Cart.findOne({ userId }).populate(
    populate ? "products.productId" : "",
  );
  if (!cart) {
    cart = new Cart({ userId, products: [] });
    await cart.save();
    status = 201;
  }
  return { status, cart };
};
