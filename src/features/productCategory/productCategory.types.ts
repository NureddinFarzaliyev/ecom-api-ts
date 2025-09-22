import { Document } from "mongoose";

export interface IProductCategory extends Document {
  _id: string;
  title: string;
  parentId: string | null;
}
