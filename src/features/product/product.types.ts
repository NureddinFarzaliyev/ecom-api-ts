import { Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  images: string[];
  category: string;
  price: number;
  salePercent: number;
  cashbackPercent: number;
  stock: number;
  isPublic: boolean;
}

export interface ProductQueries {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  priceSort?: 0 | 1;
  category?: string;
}
