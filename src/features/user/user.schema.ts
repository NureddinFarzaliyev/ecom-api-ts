import { IUser, UserRole } from "@/features/user/user.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  permissions: { type: [String], default: [] },
  code: { type: String, default: null },
});

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
  });

  return schema.validate(user);
};
