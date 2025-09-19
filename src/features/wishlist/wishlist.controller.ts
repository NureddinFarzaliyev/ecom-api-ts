import { addProductsToWishlistService } from "@/features/wishlist/util/addProductsToWishlistService.util";
import { initializeUserWishlist } from "@/features/wishlist/util/initializeUserWishlist.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const getUserWishlist = async (req: Request, res: Response) => {
  const userId = req.userId;

  const { wishlist, status } = await initializeUserWishlist(userId, true);

  const response = createSuccessResponse(
    status === 200
      ? "Wishlist retrieved successfully"
      : "Wishlist created successfully",
    wishlist,
  );
  res.status(status).json(response);
};

export const addProductToWishlist = async (req: Request, res: Response) => {
  const { productId } = sanitizeObject(req.body);
  const userId = req.userId;

  const { wishlist, status } = await addProductsToWishlistService(
    userId,
    productId,
  );

  const response = createSuccessResponse(
    "Product(s) added to wishlist successfully",
    wishlist,
  );
  res.status(status).json(response);
};

export const removeProductFromWishlist = async (
  req: Request,
  res: Response,
) => {
  const { productId } = sanitizeObject(req.body);
  const userId = req.userId;

  const { wishlist, status } = await initializeUserWishlist(userId);
  const productsToRemove = Array.isArray(productId) ? productId : [productId];

  wishlist.products = wishlist.products.filter(
    (id) => !productsToRemove.includes(id.toString()),
  );
  await wishlist.save();

  const response = createSuccessResponse(
    "Product(s) removed from wishlist successfully",
    wishlist,
  );
  res.status(status).json(response);
};
