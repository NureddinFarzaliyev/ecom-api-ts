import jwt from "jsonwebtoken";

export const createJWTToken = (
  payload: string | Buffer | object,
  options: jwt.SignOptions,
) => {
  const secretKey: jwt.Secret = process.env.JWT_SECRET || "";
  if (secretKey === "") {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, secretKey, options);
};

export const verifyJWTToken = (token: string) => {
  const secretKey: jwt.Secret = process.env.JWT_SECRET || "";
  if (secretKey === "") {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.verify(token, secretKey);
};
