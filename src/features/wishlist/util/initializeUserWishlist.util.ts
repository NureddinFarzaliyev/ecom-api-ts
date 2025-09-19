import { Wishlist } from "@/features/wishlist/wishlist.schema";

export const initializeUserWishlist = async (
  userId: string,
  populate: boolean = false,
) => {
  let status = 200;
  let wishlist = await Wishlist.findOne({ userId }).populate(
    populate ? "products" : "",
  );
  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [] });
    await wishlist.save();
    status = 201;
  }
  return { status, wishlist };
};
