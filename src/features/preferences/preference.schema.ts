import {
  IPreference,
  PreferenceType,
} from "@/features/preferences/preference.types";
import Joi from "joi";
import mongoose, { Model } from "mongoose";

const preferenceSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const Preference: Model<IPreference> = mongoose.model<IPreference>(
  "Preference",
  preferenceSchema,
);

export const validatePreferences = (preference: Partial<IPreference>) => {
  const schema = Joi.object({
    updates: Joi.alternatives().try(
      Joi.array().items(
        Joi.object({
          key: Joi.string()
            .required()
            .valid(...Object.values(PreferenceType)),
          value: Joi.any().required(),
        }),
      ),
      Joi.string(),
    ),
  });
  return schema.validate(preference);
};
