export const calculateTotalCashback = (cashbacks: { amount: number }[]) => {
  const totalCashback = cashbacks.reduce(
    (acc, cashback) => acc + cashback.amount,
    0,
  );
  return totalCashback;
};
