import { CartProduct } from "@/features/cart/cart.types";
import { initializeUserCart } from "@/features/cart/utils/initializeUserCart.util";
import { Product } from "@/features/product/product.schema";
import { Types } from "mongoose";

export const addProductsToCartService = async (
  userId: Types.ObjectId,
  products: CartProduct[],
) => {
  const { cart, status } = await initializeUserCart(userId);

  const productIds = products.map((item) => item.productId);

  const validProducts = await Product.find({
    _id: { $in: productIds },
  }).select("_id");
  const validProductIds = validProducts.map((product) =>
    product._id.toString(),
  );

  for (const item of products) {
    if (!validProductIds.includes(item.productId as string)) continue;

    const existing = cart.products.find(
      (p) => p.productId.toString() === item.productId.toString(),
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.products.push(item);
    }
  }

  await cart.save();
  return { cart, status };
};
