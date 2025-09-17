import { User, validateUserRegistration } from "@/features/user/user.schema";
import {
  AuthenticationError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { createJWTToken, verifyJWTToken } from "@/shared/utils/tokens/jwt.util";
import { IUser, UserRole } from "@/features/user/user.types";
import { sendNoreply } from "@/shared/utils/email/sendNoReply.util";
import {
  generateVerificationEmail,
  verificationEmailSubject,
} from "@/shared/utils/email/generateVerificationEmail.util";

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
  const { error } = validateUserRegistration(req.body);
  if (error) throw new ValidationError(error.details[0].message);

  const password = await bcrypt.hash(req.body.password, 10);
  const code = `${Date.now()}${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join("")}`;
  const user: IUser = new User({ ...req.body, password, code });

  const emailToken = createJWTToken({ id: user._id }, { expiresIn: "1d" });
  await sendNoreply(
    verificationEmailSubject,
    generateVerificationEmail(`${user.name} ${user.surname}`, emailToken),
    user.email,
  );

  const result = await user.save();
  const userObj = result.toObject();
  delete userObj.password;

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
