import { GuestType } from "@/shared/types/guest.types";
import { Document, Types } from "mongoose";

export enum CustomOrderStatus {
  PENDING = "PENDING",
  OFFERED = "OFFERED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum CustomOrderOfferStatus {
  PENDING = CustomOrderStatus.PENDING,
  ACCEPTED = CustomOrderStatus.ACCEPTED,
  REJECTED = CustomOrderStatus.REJECTED,
}

export enum CustomOrderOfferResponseStatus {
  ACCEPTED = CustomOrderStatus.ACCEPTED,
  REJECTED = CustomOrderStatus.REJECTED,
}

export enum CustomOrderResolveStatus {
  COMPLETED = CustomOrderStatus.COMPLETED,
  CANCELLED = CustomOrderStatus.CANCELLED,
}

export type CustomOrderOffer = {
  _id: string;
  price: number;
  message: string;
  rejectReason: string | null;
  status: CustomOrderOfferStatus;
  date: Date;
  createdBy: string;
};

export type customOrderOfferResponse = {
  status: CustomOrderOfferResponseStatus;
  rejectReason?: string;
};

export type customOrderResolve = {
  status: CustomOrderResolveStatus;
};

export interface ICustomOrder extends Document {
  code: string;
  userId: Types.ObjectId | null;
  guest: GuestType | null;
  content: string;
  link: string;
  images: string[];
  status: CustomOrderStatus;
  offers: CustomOrderOffer[];
  resolvedBy: Types.ObjectId | null;
  resolvedAt: Date | null;
}
