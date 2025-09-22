import { Document } from "mongoose";

export interface IWishlist extends Document {
  _id: string;
  userId: string;
  products: string[];
}

export interface AddToWishlistBody {
  productId: string | string[];
}

export interface RemoveFromWishlistBody extends AddToWishlistBody { }
