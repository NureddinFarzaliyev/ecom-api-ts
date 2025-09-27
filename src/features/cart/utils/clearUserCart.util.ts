import { Cart } from "@/features/cart/cart.schema";
import { NotFoundError } from "@/shared/utils/errorHandler/errors";
import { ClientSession } from "mongoose";

export const clearUserCart = async (
  userId: string,
  session?: ClientSession,
) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { products: [] },
    { session },
  );
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }
  return cart;
};
