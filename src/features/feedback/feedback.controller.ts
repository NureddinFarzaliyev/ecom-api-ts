import {
  Feedback,
  validateCreateFeedback,
  validateEditFeedback,
  validateRespondFeedback,
} from "@/features/feedback/feedback.schema";
import { FeedbackStatus } from "@/features/feedback/feedback.types";
import { UserRole } from "@/features/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { excludeFromUser } from "@/shared/utils/population/excludeFromUser.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { generateSearchByUserIdPopulatedQuery } from "@/shared/utils/search/generateSearchByUserIdPopulatedQuery";
import { generateNanoIdToken } from "@/shared/utils/tokens/nanoidToken.util";
import { Request, Response } from "express";

export const getFeedbackConfig = async (_req: Request, res: Response) => {
  const config = { FeedbackStatus };
  const response = createSuccessResponse(
    "Feedback configuration retrieved successfully",
    config,
  );
  return res.status(200).json(response);
};

export const getFeedbacks = async (req: Request, res: Response) => {
  const queryParams = sanitizeObject(req.query);
  const queryPage = queryParams.page || 1;
  const queryLimit = queryParams.limit || 10;

  const { q } = queryParams;
  const { userRole, userId } = req;
  let findQuery = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery = { userId };
  } else if (q) {
    findQuery = await generateSearchByUserIdPopulatedQuery(q, ["code"]);
  }

  const { results: feedbacks, paginationData } = await paginate(
    Feedback,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
      populate: [{ path: "userId", select: excludeFromUser }],
    },
  );

  const response = createSuccessResponse(
    "Feedback retrieved successfully",
    feedbacks,
    { paginationData },
  );
  return res.status(200).json(response);
};

export const getSingleFeedback = async (req: Request, res: Response) => {
  const { userRole, userId } = req;
  const { id } = req.params;
  const findQuery: any = { _id: id };

  if (userRole !== UserRole.ADMIN) {
    findQuery.userId = userId;
  }

  const feedback = await Feedback.findOne(findQuery).populate(
    "userId",
    excludeFromUser,
  );
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  const response = createSuccessResponse(
    "Feedback retrieved successfully",
    feedback,
  );
  return res.status(200).json(response);
};

export const createFeedback = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateCreateFeedback(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { userId } = req;
  body.userId = userId || null;

  if (!userId && !body.guest) {
    throw new ValidationError(
      "Guest information is required for anonymous feedback.",
    );
  }
  if (userId) {
    body.guest = null;
  }

  const code = `FB-${generateNanoIdToken()}`;
  body.code = code;

  const feedback = new Feedback(body);
  await feedback.save();

  const response = createSuccessResponse(
    "Feedback created successfully",
    feedback,
  );
  return res.status(201).json(response);
};

export const editFeedback = async (req: Request, res: Response) => {
  const { userId } = req;
  const { id } = req.params;
  const body = sanitizeObject(req.body);
  const { error } = validateEditFeedback(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const feedback = await Feedback.findOne({ _id: id, userId });
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  if (feedback.status !== FeedbackStatus.PENDING) {
    throw new ValidationError(
      "Only feedback with 'pending' status can be edited.",
    );
  }

  Object.assign(feedback, body);
  const newFeedback = await feedback.save();
  const response = createSuccessResponse(
    "Feedback updated successfully",
    newFeedback,
  );
  return res.status(200).json(response);
};

export const deleteFeedback = async (req: Request, res: Response) => {
  const { userId } = req;
  const { id } = req.params;

  const feedback = await Feedback.findOne({ _id: id, userId });
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  if (feedback.status !== FeedbackStatus.PENDING) {
    throw new ValidationError(
      "Only feedback with 'pending' status can be deleted.",
    );
  }

  await feedback.deleteOne();
  const response = createSuccessResponse("Feedback deleted successfully", null);
  return res.status(200).json(response);
};

export const respondFeedback = async (req: Request, res: Response) => {
  const { userId } = req;
  const { id } = req.params;

  const body = sanitizeObject(req.body);
  body.respondedBy = userId;

  const { error } = validateRespondFeedback(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const feedback = await Feedback.findOne({ _id: id });
  if (!feedback) {
    throw new NotFoundError("Feedback not found");
  }

  Object.assign(feedback, body);
  const newFeedback = await feedback.save();
  const response = createSuccessResponse(
    "Feedback responded successfully",
    newFeedback,
  );
  return res.status(200).json(response);
};
