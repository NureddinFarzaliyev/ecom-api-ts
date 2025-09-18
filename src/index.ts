// Dotenv configuration
import dotenv from "dotenv";
dotenv.config();

// Imports
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocsV1 from "@/shared/tools/swagger";
import { v1Router } from "@/features/v1/v1.router";
import { logger } from "@/shared/tools/logger";
import { requestLogger } from "@/shared/middlewares/requestLogger.middleware";
import { connectMongoDB } from "@/shared/tools/mongodb";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { limiter } from "@/shared/tools/limiter";

// App
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

// Swagger Documentation
app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocsV1));

// Version 1 Routes
app.use("/v1", v1Router);

// Connect to DB
connectMongoDB();

// Initialize
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
