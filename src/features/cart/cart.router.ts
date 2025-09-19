import {
  addProductToCart,
  getUserCart,
  removeProductFromCart,
} from "@/features/cart/cart.controller";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import Router from "express";

export const cartRouter = Router();

cartRouter.get("/", verifyJwt, getUserCart);
cartRouter.post("/", verifyJwt, addProductToCart);
cartRouter.delete("/", verifyJwt, removeProductFromCart);
