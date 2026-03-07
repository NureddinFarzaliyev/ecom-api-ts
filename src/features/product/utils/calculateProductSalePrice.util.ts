import { IProduct } from "@/features/product/product.types";

interface calulateProductSalePriceProduct {
  price: number;
  salePercent: number;
}

export const calculateProductSalePrice = (
  product: calulateProductSalePriceProduct | IProduct,
  quantity: number = 1,
) => {
  if (!product) return 0;

  const saleP = product.salePercent;
  const price = product.price;

  const priceWSale = price - (price * saleP) / 100;
  return priceWSale * quantity;
};
