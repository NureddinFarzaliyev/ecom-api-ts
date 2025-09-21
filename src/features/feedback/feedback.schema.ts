import { FeedbackStatus, IFeedback } from "@/features/feedback/feedback.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guest: {
      name: { type: String },
      surname: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
    },
    content: { type: String, required: true },
    response: { type: String, default: null },
    status: {
      type: String,
      enum: Object.values(FeedbackStatus),
      default: "pending",
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export const Feedback: Model<IFeedback> = mongoose.model<IFeedback>(
  "Feedback",
  feedbackSchema,
);

export const validateCreateFeedback = (data: Partial<IFeedback>) => {
  const schema = Joi.object({
    guest: Joi.object({
      name: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().optional(),
    }),
    content: Joi.string().required().max(2000),
  });

  return schema.validate(data);
};

export const validateEditFeedback = (data: Partial<IFeedback>) => {
  const schema = Joi.object({
    content: Joi.string().optional().max(2000),
  });

  return schema.validate(data);
};

export const validateRespondFeedback = (data: Partial<IFeedback>) => {
  const schema = Joi.object({
    response: Joi.string().required().max(2000),
    status: Joi.string()
      .valid(...Object.values(FeedbackStatus))
      .required(),
    respondedBy: Joi.string().required(),
  });

  return schema.validate(data);
};
