import {
  addProductToCart,
  getUserCart,
  removeProductFromCart,
} from "@/features/cart/cart.controller";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import Router from "express";

export const cartRouter = Router();

cartRouter.get("/", verifyJwt, errorHandler(getUserCart));
cartRouter.post("/", verifyJwt, errorHandler(addProductToCart));
cartRouter.delete("/", verifyJwt, errorHandler(removeProductFromCart));
