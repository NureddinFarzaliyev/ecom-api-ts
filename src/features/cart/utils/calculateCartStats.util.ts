import { CartProduct } from "@/features/cart/cart.types";
import { IProduct } from "@/features/product/product.types";
import { calculateProductCashback } from "@/features/product/utils/calculateProductCashback.util";
import { calculateProductSalePrice } from "@/features/product/utils/calculateProductSalePrice.util";

export const calculateCartStats = (products: CartProduct[]) => {
  const cashback = products.reduce(
    (acc, prod) =>
      acc + calculateProductCashback(prod.productId as IProduct, prod.quantity),
    0,
  );

  const totalWithSale = products.reduce(
    (acc, prod) =>
      acc +
      calculateProductSalePrice(prod.productId as IProduct, prod.quantity),
    0,
  );

  const totalWithoutSale = products.reduce((acc, prod) => {
    if (!prod || !prod.productId || !prod.productId) return acc;
    return acc + prod.quantity * (prod.productId as IProduct).price;
  }, 0);

  const totalQuantity = products.reduce((acc, prod) => acc + prod.quantity, 0);

  return { cashback, totalQuantity, totalWithoutSale, totalWithSale };
};
