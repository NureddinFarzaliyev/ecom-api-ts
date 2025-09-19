import { CartProduct } from "@/features/cart/cart.types";
import { addProductsToCartService } from "@/features/cart/utils/addProductsToCartService";
import { calculateCartStats } from "@/features/cart/utils/calculateCartStats.util";
import { initializeUserCart } from "@/features/cart/utils/initializeUserCart.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const getUserCart = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { cart, status } = await initializeUserCart(userId, true);

  const cartStats = calculateCartStats(cart.products);

  const response = createSuccessResponse(
    status === 200
      ? "Cart retrieved successfully"
      : "Cart created successfully",
    cart,
    cartStats,
  );
  res.status(status).json(response);
};

export const addProductToCart = async (req: Request, res: Response) => {
  const { products } = sanitizeObject(req.body);
  const userId = req.userId;

  const { cart, status } = await addProductsToCartService(userId, products);

  const response = createSuccessResponse(
    "Product(s) added to cart successfully",
    cart,
  );
  res.status(status).json(response);
};

export const removeProductFromCart = async (req: Request, res: Response) => {
  const { products } = sanitizeObject(req.body);
  const userId = req.userId;

  const { cart, status } = await initializeUserCart(userId);

  for (const product of products) {
    const existingProduct = cart.products.find(
      (p: CartProduct) =>
        p.productId.toString() === product.productId.toString(),
    );

    if (!existingProduct) continue;

    const diff = existingProduct.quantity - product.quantity;
    const newQuantity = Math.max(diff, 0);

    existingProduct.quantity = newQuantity;
  }

  cart.products = cart.products.filter((p) => p.quantity !== 0);

  const result = await cart.save();
  const response = createSuccessResponse(
    "Product(s) successfully removed",
    result,
  );
  res.status(status).json(response);
};
