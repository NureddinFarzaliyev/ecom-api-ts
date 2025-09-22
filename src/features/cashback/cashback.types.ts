import { Document } from "mongoose";

export interface ICashback extends Document {
  _id: string;
  userId: string;
  amount: number;
}
