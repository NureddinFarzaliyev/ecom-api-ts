import {
  ChangePasswordBody,
  IUser,
  ResetPasswordBody,
  UserRole,
} from "@/features/user/user.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    resetPasswordTokenHash: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    permissions: { type: [String], default: [] },
    code: { type: String, default: null },
  },
  { timestamps: true },
);

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export const validateUserRegistration = (user: Partial<IUser>) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid(...Object.values(UserRole))
      .default(UserRole.USER),
    permissions: Joi.array().items(Joi.string()).default([]),
    wishlist: Joi.array().items(Joi.string()).default([]),
    cart: Joi.array().items(Joi.string()).default([]),
  });

  return schema.validate(user);
};

export const validateUserLogin = (user: Partial<IUser>) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};

export const validateForgotPassword = (user: Partial<IUser>) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate(user);
};

export const validateResetPassword = (data: ResetPasswordBody) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    id: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const validateUserChangePassword = (data: ChangePasswordBody) => {
  const schema = Joi.object({
    newPassword: Joi.string().required(),
    oldPassword: Joi.string().required(),
  });

  return schema.validate(data);
};

export const validateUserUpdate = (user: Partial<IUser>) => {
  const schema = Joi.object({
    name: Joi.string(),
    surname: Joi.string(),
    phoneNumber: Joi.string(),
  });

  return schema.validate(user);
};
