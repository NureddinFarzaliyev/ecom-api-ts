export enum InstalmentRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum InstalmentPaymentStatus {
  WAITING = "waiting",
  PAID = "paid",
}

export enum InstalmentMonths {
  THREE = 3,
  SIX = 6,
  NINE = 9,
}

export interface IInstalmentRequest {
  userId: string | null;
  orderId: string | null;
  totalPrice: number;
  months: number;
  commissionRate: number;
  status: InstalmentRequestStatus;
  paymentStatus: InstalmentPaymentStatus;
}
