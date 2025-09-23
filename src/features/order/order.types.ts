import { GuestType } from "@/shared/types/guest.types";
import { Document } from "mongoose";

export enum OrderDeliveryMethod {
  PICKUP = "pickup",
  COURIER = "courier",
}

export enum OrderPaymentMethod {
  CARD = "card",
  CASH = "cash",
  INSTALMENTS = "instalments",
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DELIVERING = "delivering",
  COMPLETED = "completed",
}

export interface IOrder extends Document {
  userId: string | null;
  guest: GuestType | null;
  code: string;
  products: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    salePercent: number;
    cashbackPercent: number;
  }[];
  price: number;
  saleApplied: number;
  cashbackPayment: number;
  netPrice: number;
  cashbackEarned: number;
  delivery: {
    method: OrderDeliveryMethod;
    location: string | null;
    address: string | null;
  };
  payment: {
    method: OrderPaymentMethod;
    instalmentId: string | null;
  };
  status: OrderStatus;
  statusChangedBy: string | null;
  statusChangedAt: Date | null;
}
