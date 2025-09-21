import { IPreference } from "@/features/preferences/preference.types";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
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

export const validatePreferences = (preference: {
  updates: string | { key: string; value: string };
}) => {
  let parsedPreference = { ...preference };

  if (typeof preference.updates === "string") {
    try {
      parsedPreference.updates = JSON.parse(preference.updates as string);
    } catch (error) {
      throw new ValidationError("Invalid guest JSON format");
    }
  }

  const schema = Joi.object({
    updates: Joi.array()
      .items(
        Joi.object({
          key: Joi.string().required(),
          value: Joi.string(),
        }),
      )
      .required(),
  });
  return schema.validate(parsedPreference);
};
