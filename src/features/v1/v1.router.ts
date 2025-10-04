import { cartRouter } from "@/features/cart/cart.router";
import { cashbackRouter } from "@/features/cashback/cashback.router";
import { customOrderRouter } from "@/features/customOrder/customOrder.router";
import { feedbackRouter } from "@/features/feedback/feedback.router";
import { instalmentRequestRouter } from "@/features/instalmentRequest/instalmentRequest.router";
import { notificationRouter } from "@/features/notification/notification.router";
import { orderRouter } from "@/features/order/order.router";
import { preferenceRouter } from "@/features/preferences/preference.router";
import { productRouter } from "@/features/product/product.router";
import { productCategoryRouter } from "@/features/productCategory/productCategory.router";
import { salesCampaignRouter } from "@/features/salesCampaign/salesCampaign.router";
import { userRouter } from "@/features/user/user.router";
import { wishlistRouter } from "@/features/wishlist/wishlist.router";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { Router } from "express";

export const v1Router = Router();

v1Router.get("/", (_, res) => {
  const response = createSuccessResponse("API V1");
  res.status(200).json(response);
});

v1Router.use("/users", userRouter);
v1Router.use("/product-categories", productCategoryRouter);
v1Router.use("/products", productRouter);
v1Router.use("/wishlists", wishlistRouter);
v1Router.use("/carts", cartRouter);
v1Router.use("/preferences", preferenceRouter);
v1Router.use("/feedbacks", feedbackRouter);
v1Router.use("/custom-orders", customOrderRouter);
v1Router.use("/cashbacks", cashbackRouter);
v1Router.use("/notifications", notificationRouter);
v1Router.use("/orders", orderRouter);
v1Router.use("/instalment-requests", instalmentRequestRouter);
v1Router.use("/sales-campaigns", salesCampaignRouter);
