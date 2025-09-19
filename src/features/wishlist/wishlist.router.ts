import {
  addProductToWishlist,
  getUserWishlist,
  removeProductFromWishlist,
} from "@/features/wishlist/wishlist.controller";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const wishlistRouter = Router();

wishlistRouter.get("/", verifyJwt, errorHandler(getUserWishlist));
wishlistRouter.post("/", verifyJwt, errorHandler(addProductToWishlist));
wishlistRouter.delete("/", verifyJwt, errorHandler(removeProductFromWishlist));
