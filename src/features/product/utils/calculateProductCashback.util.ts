import { IProduct } from "@/features/product/product.types";

export const calculateProductCashback = (
  product: IProduct,
  quantity: number = 1,
) => {
  const cashbackP = product.cashbackPercent;
  const saleP = product.salePercent;
  const price = product.price;

  const priceWSale = price - (price * saleP) / 100;
  const cashback = (priceWSale * cashbackP) / 100;
  const totalCashback = cashback * quantity;

  return totalCashback;
};
