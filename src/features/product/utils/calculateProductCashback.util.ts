import { IProduct } from "@/features/product/product.types";

interface calculateProductCashbackInput {
  cashbackPercent: number;
  salePercent: number;
  price: number;
}

export const calculateProductCashback = (
  product: calculateProductCashbackInput | IProduct,
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
