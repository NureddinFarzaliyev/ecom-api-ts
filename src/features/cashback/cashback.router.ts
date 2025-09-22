import { getCashbacks } from "@/features/cashback/cashback.controller";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const cashbackRouter = Router();

cashbackRouter.get("/", verifyJwt, errorHandler(getCashbacks));
