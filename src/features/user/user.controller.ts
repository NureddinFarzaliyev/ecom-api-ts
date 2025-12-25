import {
  User,
  validateForgotPassword,
  validateResetPassword,
  validateUserChangePassword,
  validateUserLogin,
  validateUserRegistration,
  validateUserUpdate,
} from "@/features/user/user.schema";
import {
  AuthenticationError,
  ForbiddenError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { CookieOptions, NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { createJWTToken, verifyJWTToken } from "@/shared/utils/tokens/jwt.util";
import {
  ChangePasswordBody,
  IUser,
  ResetPasswordBody,
  UserRole,
} from "@/features/user/user.types";
import { sendNoreply } from "@/shared/utils/email/sendNoReply.util";
import {
  generateVerificationEmail,
  verificationEmailSubject,
} from "@/shared/utils/email/generateVerificationEmail.util";
import { generateUserCode } from "@/features/user/utils/generateUserCode.util";
import { generateCsrfToken } from "@/shared/utils/tokens/csrf.util";
import { addProductsToWishlistService } from "@/features/wishlist/util/addProductsToWishlistService.util";
import { addProductsToCartService } from "@/features/cart/utils/addProductsToCartService";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { generateResetPassToken } from "@/shared/utils/tokens/resetPass.util";
import { hashToken } from "@/shared/utils/tokens/hashToken.util";
import {
  generatePasswordResetEmail,
  passwordResetEmailSubject,
} from "@/shared/utils/email/generatePasswordResetEmail.util";
import { excludeFromUser } from "@/shared/utils/population/excludeFromUser.util";
import { createNotification } from "@/features/notification/utils/createNotification.util";
import { NotificationType } from "@/features/notification/notification.types";

export const getUserConfig = async (_req: Request, res: Response) => {
  const response = createSuccessResponse("User config received", {
    roles: UserRole,
  });
  res.status(200).json(response);
};

export const registerUser = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const body = sanitizeObject(req.body);
  const { error } = validateUserRegistration(body);
  if (error) throw new ValidationError(error.details[0].message);

  const password = await bcrypt.hash(body.password, 10);
  const code = generateUserCode();
  const user: IUser = new User({ ...body, password, code });

  const emailToken = createJWTToken({ id: user._id }, { expiresIn: "1h" });
  await sendNoreply(
    verificationEmailSubject,
    generateVerificationEmail(`${user.name} ${user.surname}`, emailToken),
    user.email,
  );

  const result = await user.save();
  const userObj = result.toObject();
  delete userObj.password;

  const wishlist = body.wishlist;
  if (wishlist && wishlist.length > 0) {
    await addProductsToWishlistService(user._id, wishlist);
  }

  const cart = body.cart;
  if (cart && cart.length > 0) {
    await addProductsToCartService(user._id, cart);
  }

  const response = createSuccessResponse(
    "User sucessfully registered",
    userObj,
  );
  res.status(201).json(response);
};

export const verifyUser = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) throw new AuthenticationError("No token provided");

  const decoded = verifyJWTToken(token) as { id: string };
  const user = await User.findById(decoded.id);

  if (!user) throw new AuthenticationError("Invalid token");
  if (user.isVerified) throw new ValidationError("User already verified");

  user.isVerified = true;
  await user.save();

  const response = createSuccessResponse("User successfully verified");
  res.status(200).json(response);
};

const generalCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  // domain: process.env.DOMAIN,
  path: "/",
  partitioned: true,
};

export const loginUser = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateUserLogin(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) throw new ForbiddenError("Invalid email or password");

  if (!user.isVerified)
    throw new ForbiddenError("Please verify your email before logging in");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ForbiddenError("Invalid email or password");

  const token = createJWTToken(
    { email: email, id: user._id, role: user.role },
    { expiresIn: "7d" },
  );

  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  res.cookie("jwt", token, {
    ...generalCookieOptions,
    maxAge,
  });

  const csrfToken = generateCsrfToken();

  res.cookie("XSRF-TOKEN", csrfToken, {
    ...generalCookieOptions,
    maxAge,
  });

  const response = createSuccessResponse("Sucessfully logged in", {
    csrfToken,
  });
  res.status(200).json(response);
};

export const logoutUser = async (_req: Request, res: Response) => {
  res.clearCookie("jwt", generalCookieOptions);
  res.clearCookie("XSRF-TOKEN", generalCookieOptions);
  const response = createSuccessResponse("Sucessfully logged out");
  res.status(200).json(response);
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.userId).select(excludeFromUser);
  if (!user) throw new AuthenticationError("User not found");
  const response = createSuccessResponse("User data retrieved", user);
  res.status(200).json(response);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateForgotPassword(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const response = createSuccessResponse("Email sent");
  const user = await User.findOne({ email: body.email });
  if (!user) {
    res.status(200).json(response);
    return;
  }

  const token = generateResetPassToken();
  const tokenHash = hashToken(token);

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
  await user.save();

  await sendNoreply(
    passwordResetEmailSubject,
    generatePasswordResetEmail(token, user._id),
    user.email,
  );

  res.status(200).json(response);
};

export const resetPassword = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateResetPassword(body as ResetPasswordBody);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { token, id, newPassword } = body;

  const user = await User.findOne({
    _id: id,
    resetPasswordTokenHash: hashToken(token),
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ValidationError("Invalid or expired password reset token");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpires = null;
  user.passwordChangedAt = new Date();

  await user.save();

  const response = createSuccessResponse("Password successfully reset");
  res.status(200).json(response);
};

export const changePassword = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateUserChangePassword(body as ChangePasswordBody);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) throw new AuthenticationError("Authentication Error");

  const isOldPassCorrect = await bcrypt.compare(
    body.oldPassword,
    user.password,
  );

  if (!isOldPassCorrect) {
    throw new AuthenticationError("Old password is incorrect");
  }

  const newPassHashed = await bcrypt.hash(body.newPassword, 10);
  user.password = newPassHashed;
  const date = new Date();
  user.passwordChangedAt = date;

  await user.save();
  createNotification({
    userId,
    title: "Password Changed",
    content: `Your password is changed at ${date}. If it is not you who did this action, please change your password again immediately.`,
    type: NotificationType.WARN,
  });

  const response = createSuccessResponse("Password successfully changed");
  res.status(200).json(response);
};

export const updateUser = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateUserUpdate(body);

  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const user = await User.findById(req.userId);
  if (!user) throw new AuthenticationError("User not found");

  Object.assign(user, body);
  const newUser = await user.save();
  const response = createSuccessResponse("User successfully updated", newUser);
  res.status(200).json(response);
};
