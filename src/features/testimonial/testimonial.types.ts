import { Document } from "mongoose";

export interface ITestimonial extends Document {
  title: string;
  content: string;
  image: string;
  isActive: boolean;
}
