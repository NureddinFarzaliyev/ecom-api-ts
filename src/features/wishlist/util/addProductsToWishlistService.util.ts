import { Product } from "@/features/product/product.schema";
import { initializeUserWishlist } from "@/features/wishlist/util/initializeUserWishlist.util";
import { Types } from "mongoose";

export const addProductsToWishlistService = async (
  userId: Types.ObjectId,
  productId: string | string[],
) => {
  const { wishlist, status } = await initializeUserWishlist(userId);
  const productsToAdd = Array.isArray(productId) ? productId : [productId];

  const newProducts = productsToAdd.filter(
    (id) => !wishlist.products.includes(id),
  );
  if (newProducts.length > 0) {
    const validProducts = await Product.find({
      _id: { $in: newProducts },
    }).select("_id");
    const validProductIds = validProducts.map((product) =>
      product._id.toString(),
    );
    const validNewProducts = newProducts.filter((id) =>
      validProductIds.includes(id),
    );
    wishlist.products.push(...validNewProducts);
    await wishlist.save();
  }

  return { wishlist, status };
};
