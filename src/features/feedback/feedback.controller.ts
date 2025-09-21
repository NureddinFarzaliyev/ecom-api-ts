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
import { excludeFromUser } from "@/shared/utils/population/excludeFromUser.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { generateTimestampToken } from "@/shared/utils/tokens/timestampToken.util";
import { Request, Response } from "express";

export const getFeedbacks = async (req: Request, res: Response) => {
  const { userRole, userId } = req;
  const findQuery: any = {};

  if (userRole !== UserRole.ADMIN) {
    findQuery.userId = userId;
  }

  const feedbackList = await Feedback.find(findQuery)
    .sort({ createdAt: -1 })
    .populate("userId", excludeFromUser);
  const response = createSuccessResponse(
    "Feedback retrieved successfully",
    feedbackList,
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

  const feedback = await Feedback.find(findQuery)
    .sort({ createdAt: -1 })
    .populate("userId", excludeFromUser);
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

  const code = `FB-${generateTimestampToken()}`;
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
