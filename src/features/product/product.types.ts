export interface IProduct {
  _id: string;
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
