import { Document, Types } from "mongoose";

export interface ICashback extends Document {
  userId: Types.ObjectId;
  amount: number;
}
