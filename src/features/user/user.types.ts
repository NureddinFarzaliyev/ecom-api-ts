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
  resetPasswordTokenHash: string | null;
  resetPasswordExpires: Date | null;
  passwordChangedAt: Date | null;
  role: UserRole;
  permissions: string[];
  code: number;
}

export interface ResetPasswordBody {
  token: string;
  id: string;
  newPassword: string;
}
