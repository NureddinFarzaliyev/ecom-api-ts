import { ITestimonial } from "@/features/testimonial/testimonial.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const testimonialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export const Testimonial: Model<ITestimonial> = mongoose.model<ITestimonial>(
  "Testimonial",
  testimonialSchema,
);

export const validateCreateTestimonial = (testimonial: ITestimonial) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.string().required(),
    isActive: Joi.boolean().default(true),
  });

  return schema.validate(testimonial);
};

export const validateEditTestimonial = (testimonial: ITestimonial) => {
  const schema = Joi.object({
    title: Joi.string(),
    content: Joi.string(),
    image: Joi.string(),
    isActive: Joi.boolean(),
  });

  return schema.validate(testimonial);
};
