import { ISalesCampaign } from "@/features/salesCampaign/salesCampaign.types";
import { parseStringJSON } from "@/shared/utils/JSONParsers/parseStringJSON.util";
import Joi from "joi";
import mongoose, { Model, Schema } from "mongoose";

const salesCampaignSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: false },
    startsAt: { type: Date },
    endsAt: { type: Date },
    isHighlighted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const SalesCampaign: Model<ISalesCampaign> =
  mongoose.model<ISalesCampaign>("SalesCampaign", salesCampaignSchema);

export const validateCreateSalesCampaign = (data: Partial<ISalesCampaign>) => {
  let parsedCampaign = { ...data };
  parsedCampaign.products = parseStringJSON(data.products);

  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    banner: Joi.string().required(),
    products: Joi.array().items(Joi.string().hex().length(24)).required(),
    isActive: Joi.boolean(),
    startsAt: Joi.date(),
    endsAt: Joi.date(),
    isHighlighted: Joi.bool().default(false),
  });
  return schema.validate(data);
};

export const validateEditSalesCampaign = (data: Partial<ISalesCampaign>) => {
  let parsedCampaign = { ...data };
  parsedCampaign.products = parseStringJSON(data.products);

  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    banner: Joi.string(),
    products: Joi.array().items(Joi.string().hex().length(24)),
    isActive: Joi.boolean(),
    startsAt: Joi.date(),
    endsAt: Joi.date(),
    isHighlighted: Joi.bool(),
  });
  return schema.validate(parsedCampaign);
};
