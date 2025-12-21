import { IPartner } from "@/features/partner/partner.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const partnerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

export const Partner: Model<IPartner> = mongoose.model<IPartner>(
  "Partner",
  partnerSchema,
);

export const validateCreatePartner = (partner: IPartner) => {
  const schema = Joi.object({
    imageUrl: Joi.string().required(),
  });

  return schema.validate(partner);
};

export const validateEditPartner = (partner: IPartner) => {
  return validateCreatePartner(partner);
};
