import {
  IPreference,
  PreferenceUpdate,
} from "@/features/preferences/preference.types";
import { parseStringJSON } from "@/shared/utils/JSONParsers/parseStringJSON.util";
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

export const validatePreferences = (preference: PreferenceUpdate) => {
  let parsedPreference = { ...preference };
  parsedPreference.updates = parseStringJSON(preference.updates);

  const schema = Joi.object({
    updates: Joi.array()
      .items(
        Joi.object({
          key: Joi.string().required(),
          value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        }),
      )
      .required(),
  });
  return schema.validate(parsedPreference);
};
