import { Document } from "mongoose";

export interface IWishlist extends Document {
  userId: string;
  products: string[];
}

export interface AddToWishlistBody {
  productId: string | string[];
}

export interface RemoveFromWishlistBody extends AddToWishlistBody {}
