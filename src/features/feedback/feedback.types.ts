import { GuestType } from "@/shared/types/guest.types";

export enum FeedbackStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  RESOLVED = "resolved",
}

export interface IFeedback {
  _id: string;
  code: string;
  userId: string | null;
  guest: GuestType | null;
  content: string;
  response: string | null;
  status: FeedbackStatus;
  respondedBy: string | null;
}
