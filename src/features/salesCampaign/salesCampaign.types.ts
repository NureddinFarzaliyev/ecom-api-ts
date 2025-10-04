import { Document } from "mongoose";

export interface ISalesCampaign extends Document {
  title: string;
  description: string;
  banner: string;
  products: string[];
  isActive: boolean;
}
