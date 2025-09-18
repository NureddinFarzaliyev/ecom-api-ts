import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: process.env.NODE_ENV === "production" ? 100 : 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 60,
});
