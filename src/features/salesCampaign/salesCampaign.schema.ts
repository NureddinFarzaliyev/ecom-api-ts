import { ISalesCampaign } from "@/features/salesCampaign/salesCampaign.types";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
import Joi from "joi";
import mongoose, { Model, Schema } from "mongoose";

const salesCampaignSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const SalesCampaign: Model<ISalesCampaign> =
  mongoose.model<ISalesCampaign>("SalesCampaign", salesCampaignSchema);

export const validateCreateSalesCampaign = (data: Partial<ISalesCampaign>) => {
  let parsedCampaign = { ...data };

  if (typeof data.products === "string") {
    try {
      parsedCampaign.products = JSON.parse(data.products as string);
    } catch (error) {
      throw new ValidationError("Invalid JSON format");
    }
  }

  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    banner: Joi.string().required(),
    products: Joi.array().items(Joi.string().hex().length(24)).required(),
    isActive: Joi.boolean(),
  });
  return schema.validate(data);
};

export const validateEditSalesCampaign = (data: Partial<ISalesCampaign>) => {
  let parsedCampaign = { ...data };

  if (typeof data.products === "string") {
    try {
      parsedCampaign.products = JSON.parse(data.products as string);
    } catch (error) {
      throw new ValidationError("Invalid JSON format");
    }
  }

  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    banner: Joi.string(),
    products: Joi.array().items(Joi.string().hex().length(24)),
    isActive: Joi.boolean(),
  });
  return schema.validate(parsedCampaign);
};
