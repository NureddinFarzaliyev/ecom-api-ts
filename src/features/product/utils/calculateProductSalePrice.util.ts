import { IProduct } from "@/features/product/product.types";

export const calculateProductSalePrice = (
  product: IProduct,
  quantity: number = 1,
) => {
  const saleP = product.salePercent;
  const price = product.price;

  const priceWSale = price - (price * saleP) / 100;
  return priceWSale * quantity;
};
