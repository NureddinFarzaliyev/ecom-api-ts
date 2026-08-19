import { Document } from "mongoose";

export interface IProductCategory extends Document {
  title: string;
  parentId: string | null;
}
