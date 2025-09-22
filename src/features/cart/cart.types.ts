import { IProduct } from "@/features/product/product.types";
import { Document } from "mongoose";

export interface CartProduct {
  productId: string | IProduct;
  quantity: number;
}

export interface ICart extends Document {
  _id: string;
  userId: string;
  products: CartProduct[];
}

export interface AddProductsToCartInput {
  products: CartProduct[];
}

export interface RemoveProductsFromCartInput extends AddProductsToCartInput { }
