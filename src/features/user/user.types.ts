import { Document } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser extends Document {
  _id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  isVerified?: boolean;
  password: string;
  role: UserRole;
  permissions: string[];
  code: number;
}
