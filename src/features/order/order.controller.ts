import { Cart } from "@/features/cart/cart.schema";
import { initializeUserCart } from "@/features/cart/utils/initializeUserCart.util";
import { calculateUserCashback } from "@/features/cashback/utils/calculateUserCashback.util";
import { createCashback } from "@/features/cashback/utils/createCashback.util";
import { createInstalmentRequest } from "@/features/instalmentRequest/utils/createInstalmentRequest.util";
import { NotificationType } from "@/features/notification/notification.types";
import { createNotification } from "@/features/notification/utils/createNotification.util";
import {
  Order,
  validateCreateOrder,
  validateUpdateOrderStatus,
} from "@/features/order/order.schema";
import {
  IOrder,
  OrderDeliveryMethod,
  OrderPaymentMethod,
  OrderStatus,
} from "@/features/order/order.types";
import { Product } from "@/features/product/product.schema";
import { calculateProductCashback } from "@/features/product/utils/calculateProductCashback.util";
import { calculateProductSalePrice } from "@/features/product/utils/calculateProductSalePrice.util";
import { UserRole } from "@/features/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { excludeFromUserStrict } from "@/shared/utils/population/excludeFromUser.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { generateTimestampToken } from "@/shared/utils/tokens/timestampToken.util";
import { NextFunction, Request, Response } from "express";
import { ClientSession, Document } from "mongoose";

export const getOrderConfig = async (_req: Request, res: Response) => {
  const config = {
    OrderDeliveryMethod,
    OrderPaymentMethod,
    OrderStatus,
  };

  const response = createSuccessResponse(
    "Order config retrieved successfully",
    config,
  );

  return res.status(200).json(response);
};

export const getOrders = async (req: Request, res: Response) => {
  const queryParams = sanitizeObject(req.query);
  const queryPage = queryParams.page || 1;
  const queryLimit = queryParams.limit || 10;

  const { userRole, userId } = req;
  const findQuery: any = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery.userId = userId;
  }

  const { results: orders, paginationData } = await paginate(Order, findQuery, {
    page: queryPage,
    limit: queryLimit,
    populate: [{ path: "userId", select: excludeFromUserStrict }],
  });

  const response = createSuccessResponse(
    "Orders retrieved successfully",
    orders,
    { paginationData },
  );
  return res.status(200).json(response);
};

export const getSingleOrder = async (req: Request, res: Response) => {
  const { userRole, userId } = req;
  const { id } = req.params;
  const findQuery: any = { _id: id };
  if (userRole !== UserRole.ADMIN) {
    findQuery.userId = userId;
  }

  const order = await Order.findOne(findQuery).populate({
    path: "userId",
    select: excludeFromUserStrict,
  });
  if (!order) {
    throw new ValidationError("Order not found");
  }

  const response = createSuccessResponse("Order retrieved successfully", order);
  return res.status(200).json(response);
};

export const createOrder = async (
  req: Request,
  res: Response,
  _next: NextFunction,
  session?: ClientSession,
) => {
  const body = sanitizeObject(req.body);
  const { error } = validateCreateOrder(body as IOrder);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { userId } = req;

  // Validate body based on authentication status
  if (!userId && !body.guest) {
    throw new ValidationError(
      "Not-authenticated user should provide guest info",
    );
  }
  if (!userId && !body.cart) {
    throw new ValidationError("Not-authenticated user should provide cart");
  }
  if (userId) {
    delete body.guest;
  }

  // Generate order code
  const code = `OR-${generateTimestampToken()}`;

  // get cart
  let cart: any[] = [];
  if (userId) {
    const response = await initializeUserCart(userId, true);
    cart = response.cart.products;
    if (cart.length === 0) {
      throw new ValidationError("User cart is empty");
    }
  } else if (body.cart) {
    cart = body.cart;
  }
  delete body.cart;

  // transfer items to order with snapshots
  let orderProducts;
  if (userId) {
    orderProducts = cart.map((item: any) => ({
      productId: item.productId._id,
      title: item.productId.title,
      quantity: item.quantity,
      price: item.productId.price,
      salePercent: item.productId.salePercent,
      cashbackPercent: item.productId.cashbackPercent,
    }));
  } else {
    const productIds = cart.map((item: any) => item.productId);
    const uniqueProductIds = [...new Set(productIds)];
    if (uniqueProductIds.length !== productIds.length) {
      throw new ValidationError("Duplicate products in cart");
    }

    const dbProducts = await Product.find({ _id: { $in: productIds } });

    orderProducts = dbProducts.map((dbProduct) => {
      const cartItem = cart.find(
        (item: any) => item.productId === dbProduct._id.toString(),
      );
      return {
        productId: dbProduct._id,
        title: dbProduct.title,
        quantity: cartItem.quantity,
        price: dbProduct.price,
        salePercent: dbProduct.salePercent,
        cashbackPercent: dbProduct.cashbackPercent,
      };
    });
  }

  // calculate prices
  const price = orderProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const salePrice = orderProducts.reduce(
    (total, item) => total + calculateProductSalePrice(item, item.quantity),
    0,
  );

  const saleApplied = price - salePrice;

  const cashbackEarned = orderProducts.reduce(
    (total, item) => total + calculateProductCashback(item, item.quantity),
    0,
  );

  // apply cashback if requested
  let paidFromCashback = 0;
  if (userId && body.cashbackPayment) {
    const userCashback = await calculateUserCashback(userId);
    paidFromCashback = Math.min(salePrice, userCashback);
  }

  // find netPrice with cashback and sale
  const netPrice = salePrice - paidFromCashback;

  const orderData = {
    ...body,
    code,
    userId,
    products: orderProducts,
    price,
    saleApplied,
    cashbackEarned,
    cashbackPayment: paidFromCashback,
    netPrice,
    status: OrderStatus.PENDING,
  };

  const order = new Order(orderData);

  if (body.payment.method === OrderPaymentMethod.INSTALMENTS) {
    const instalment = await createInstalmentRequest(
      {
        userId,
        orderId: (order._id as Document).toString(),
        fin: body.payment.instalmentFin,
        totalPrice: netPrice,
        months: body.payment.instalmentMonths,
      },
      session,
    );

    order.payment.instalmentId = instalment._id.toString();
  }

  await order.save({ session });

  // ======== SUCCESS LINE ======== //

  if (userId) {
    // send notification
    await createNotification(
      {
        userId,
        title: "Order Created",
        content:
          "Order Successfully Created. Use profile to track order status",
        type: NotificationType.SUCCESS,
      },
      session,
    );

    // clear user's cart
    await Cart.findOneAndUpdate({ userId }, { products: [] }, { session });

    // deduct cashback if applied
    if (paidFromCashback > 0) {
      await createCashback(userId, -paidFromCashback, null, session);
    }

    await createCashback(userId, cashbackEarned, null, session);
  }

  const response = createSuccessResponse("Order created successfully", order);
  res.json(response);
};

export const changeOrderStatus = async (req: Request, res: Response) => {
  const { userId } = req;
  const { id } = req.params;

  const body = sanitizeObject(req.body);
  const { error } = validateUpdateOrderStatus(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new NotFoundError("Order not found");
  }
  if (order.status === body.status) {
    throw new ValidationError("Order already in this status");
  }

  order.status = body.status;
  order.statusChangedBy = userId;
  order.statusChangedAt = new Date();

  const result = await order.save();

  await createNotification({
    userId: order.userId?.toString(),
    title: "Order Status Updated",
    content: `Order status updated to ${body.status}. Use profile to track order status`,
    type: NotificationType.INFO,
  });

  const response = createSuccessResponse(
    "Order status updated successfully",
    result,
  );
  return res.status(200).json(response);
};
