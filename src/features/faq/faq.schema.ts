import { IFaq } from "@/features/faq/faq.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  isActive: { type: Boolean, required: false, default: true },
});

export const Faq: Model<IFaq> = mongoose.model<IFaq>("Faq", faqSchema);

export const validateCreateFaq = (faq: IFaq) => {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    isActive: Joi.boolean().default(true),
  });

  return schema.validate(faq);
};

export const validatePatchFaq = (faq: IFaq) => {
  const schema = Joi.object({
    question: Joi.string(),
    answer: Joi.string(),
    isActive: Joi.boolean(),
  });

  return schema.validate(faq);
};
