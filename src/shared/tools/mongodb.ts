import { logger } from "@/shared/tools/logger";
import mongoose from "mongoose";

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.bfs8zjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
  }
};
