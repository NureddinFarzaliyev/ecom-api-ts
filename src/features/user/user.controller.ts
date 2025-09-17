import { User, validateUserRegistration } from "@/features/user/user.schema";
import {
  AuthenticationError,
  ForbiddenError,
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
import { generateUserCode } from "@/features/user/utils/generateUserCode.util";
import { generateCsrfToken } from "@/shared/utils/tokens/csrf.util";

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
  const code = generateUserCode();
  const user: IUser = new User({ ...req.body, password, code });

  const emailToken = createJWTToken({ id: user._id }, { expiresIn: "1h" });
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

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ForbiddenError("Invalid email or password");

  if (!user.isVerified)
    throw new ForbiddenError("Please verify your email before logging in");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ForbiddenError("Invalid email or password");

  const token = createJWTToken(
    { email: email, id: user._id },
    { expiresIn: "7d" },
  );

  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    // domain: process.env.DOMAIN,
    path: "/",
    partitioned: true,
    maxAge,
  });

  const csrfToken = generateCsrfToken();

  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    // domain: process.env.DOMAIN,
    path: "/",
    partitioned: true,
    maxAge,
  });

  const response = createSuccessResponse("Sucessfully logged in", {
    csrfToken,
  });
  res.status(200).json(response);
};
