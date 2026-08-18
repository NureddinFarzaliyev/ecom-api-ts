import { logger } from "@/shared/tools/logger";
import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB_URI as string);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
  }
};
