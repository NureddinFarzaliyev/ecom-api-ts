import {
  CustomOrder,
  validateCreateCustomOrder,
  validateCreateCustomOrderOffer,
  validateEditCustomOrder,
  validateResolveCustomOrder,
  validateRespondCustomOrderOffer,
} from "@/features/customOrder/customOrder.schema";
import {
  CustomOrderOffer,
  customOrderOfferResponse,
  CustomOrderOfferResponseStatus,
  CustomOrderOfferStatus,
  customOrderResolve,
  CustomOrderResolveStatus,
  CustomOrderStatus,
} from "@/features/customOrder/customOrder.types";
import { UserRole } from "@/features/user/user.types";
import {
  fileLimitMB,
  UploadField,
} from "@/shared/middlewares/multer.middleware";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { deleteFiles } from "@/shared/utils/files/deleteFiles.util";
import { extractPaginationQueries } from "@/shared/utils/pagination/extractPaginationQueries";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import {
  excludeFromUser,
  excludeFromUserStrict,
} from "@/shared/utils/population/excludeFromUser.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { generateSearchByUserIdPopulatedQuery } from "@/shared/utils/search/generateSearchByUserIdPopulatedQuery";
import { generateNanoIdToken } from "@/shared/utils/tokens/nanoidToken.util";
import { Request, Response } from "express";

export const getCustomOrdersConfig = async (_req: Request, res: Response) => {
  const config = {
    CustomOrderStatus,
    CustomOrderResolveStatus,
    CustomOrderOfferStatus,
    CustomOrderOfferResponseStatus,
    uploadFieldName: UploadField.CustomOrderImage,
    fileLimitMB,
  };

  const response = createSuccessResponse("Custom order config", config);
  res.status(200).json(response);
};

export const getCustomOrders = async (req: Request, res: Response) => {
  const queryParams = sanitizeObject(req.query);
  const { queryPage, queryLimit } = extractPaginationQueries(queryParams, true);
  const { q } = queryParams;
  const { userRole, userId } = req;

  let findQuery = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery = { userId };
  } else if (q) {
    findQuery = await generateSearchByUserIdPopulatedQuery(q, ["code"]);
  }

  const { results: orders, paginationData } = await paginate(
    CustomOrder,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
      populate: [
        { path: "userId", select: excludeFromUser },
        { path: "resolvedBy", select: excludeFromUserStrict },
      ],
    },
  );

  const response = createSuccessResponse("Custom responses", orders, {
    paginationData,
  });
  res.status(200).json(response);
};

export const getSingleCustomOrder = async (req: Request, res: Response) => {
  const { userRole, userId } = req;
  const { id } = req.params;
  let findQuery: { _id: string; userId?: string } = { _id: id };
  if (userRole !== UserRole.ADMIN) {
    findQuery.userId = userId;
  }

  const order = await CustomOrder.findOne(findQuery)
    .populate("userId", excludeFromUser)
    .populate("resolvedBy", excludeFromUserStrict);
  if (!order) {
    throw new NotFoundError("Custom order not found");
  }

  const response = createSuccessResponse("Custom response", order);
  res.status(200).json(response);
};

export const createCustomOrder = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateCreateCustomOrder(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const userId = req.userId || null;
  body.userId = userId;
  if (userId && body.guest) {
    body.guest = null;
  }

  if (!userId && !body.guest) {
    throw new ValidationError(
      "Guest information is required for anonymous feedback.",
    );
  }

  if (body.guest && typeof body.guest === "string") {
    body.guest = JSON.parse(body.guest as string);
  }

  const code = `CO-${generateNanoIdToken()}`;
  body.code = code;
  body.status = CustomOrderStatus.PENDING;

  const files = req.files as Express.Multer.File[];
  body.images = files && files.length > 0 ? files.map((file) => file.path) : [];

  const order = new CustomOrder(body);
  await order.save();

  const response = createSuccessResponse("Success created", order);
  res.status(201).json(response);
};

export const editCustomOrder = async (req: Request, res: Response) => {
  const { userId } = req;
  const { id } = req.params;

  const body = sanitizeObject(req.body);
  const { error } = validateEditCustomOrder(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const order = await CustomOrder.findOne({ _id: id, userId });
  if (!order) {
    throw new NotFoundError("Custom order not found.");
  }

  if (order.status !== CustomOrderStatus.PENDING) {
    throw new ValidationError("Only pending custom orders can be edited.");
  }

  const files = req.files as Express.Multer.File[];

  if (files && (files.length as number) > 0) {
    await deleteFiles(order.images);
    order.images = files.map((file) => file.path);
  }

  Object.assign(order, body);
  const result = await order.save();
  const response = createSuccessResponse("Success updated", result);
  res.status(200).json(response);
};

export const createCustomOrderOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = sanitizeObject(req.body);
  const { error } = validateCreateCustomOrderOffer(body as CustomOrderOffer);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const order = await CustomOrder.findById(id);
  if (!order) {
    throw new NotFoundError("Custom order not found");
  }

  if (
    [
      CustomOrderStatus.ACCEPTED,
      CustomOrderStatus.CANCELLED,
      CustomOrderStatus.COMPLETED,
      CustomOrderStatus.OFFERED,
    ].includes(order.status)
  ) {
    throw new ValidationError(
      `Cannot create an offer for this custom order as it is ${order.status}.`,
    );
  }

  body.createdBy = req.userId as string;
  body.status = CustomOrderOfferStatus.PENDING;
  body.date = new Date();

  order.offers.push(body as CustomOrderOffer);
  order.status = CustomOrderStatus.OFFERED;

  const result = await order.save();

  const response = createSuccessResponse("Success created", result);
  res.status(201).json(response);
};

export const respondCustomOrderOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const body = sanitizeObject(req.body);

  const { error } = validateRespondCustomOrderOffer(
    body as customOrderOfferResponse,
  );
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const order = await CustomOrder.findOne({ _id: id, userId: userId });
  if (!order) {
    throw new NotFoundError("Custom order not found");
  }

  const pendingOfferIndex = order.offers.findIndex(
    (offer) => offer.status === CustomOrderOfferStatus.PENDING,
  );
  if (pendingOfferIndex === -1) {
    throw new ValidationError("No pending offer found for this custom order.");
  }

  if (order.status !== CustomOrderStatus.OFFERED) {
    throw new ValidationError("Cannot respond to this offer.");
  }

  order.offers[pendingOfferIndex].status = body.status;
  if (body.rejectReason) {
    order.offers[pendingOfferIndex].rejectReason = body.rejectReason;
  }

  order.status = body.status;

  const result = await order.save();
  const response = createSuccessResponse("Success updated", result);
  res.status(200).json(response);
};

export const resolveCustomOrder = async (req: Request, res: Response) => {
  const { userId } = req;
  const { id } = req.params;
  const body = sanitizeObject(req.body);
  const { error } = validateResolveCustomOrder(body as customOrderResolve);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const order = await CustomOrder.findById(id);
  if (!order) {
    throw new NotFoundError("Custom order not found");
  }

  order.resolvedBy = userId as string;
  order.resolvedAt = new Date();
  order.status = body.status;

  const result = await order.save();
  const response = createSuccessResponse("Success updated", result);
  res.status(200).json(response);
};

export const deleteCustomOrder = async (req: Request, res: Response) => {
  const { userId } = req;
  const { id } = req.params;

  const order = await CustomOrder.findOneAndDelete({ _id: id, userId });
  if (!order) {
    throw new NotFoundError("Custom order not found");
  }

  if (order.status !== CustomOrderStatus.PENDING) {
    throw new ValidationError("Only pending custom orders can be deleted.");
  }

  const response = createSuccessResponse("Success deleted", order);
  res.status(200).json(response);
};
