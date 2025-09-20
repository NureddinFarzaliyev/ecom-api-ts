import { IProduct } from "@/features/product/product.types";

export interface CartProduct {
  productId: string | IProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  products: CartProduct[];
}

export interface AddProductsToCartInput {
  products: CartProduct[];
}

export interface RemoveProductsFromCartInput extends AddProductsToCartInput { }
