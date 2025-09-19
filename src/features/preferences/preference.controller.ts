import {
  Preference,
  validatePreferences,
} from "@/features/preferences/preference.schema";
import {
  PreferenceCategory,
  PreferenceType,
} from "@/features/preferences/preference.types";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";
import { AnyBulkWriteOperation } from "mongoose";

export const getPreferencesConfig = async (_req: Request, res: Response) => {
  const response = createSuccessResponse("Preferences config", {
    preferences: PreferenceType,
    categories: PreferenceCategory,
  });
  res.status(200).json(response);
};

export const getAllPreferences = async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  if (category) {
    if (
      !Object.values(PreferenceCategory).includes(
        category as PreferenceCategory,
      )
    ) {
      throw new ValidationError("Invalid category");
    }
    const regex = new RegExp(`^${category}:\\w+$`, "i");
    const preferences = await Preference.find({ key: { $regex: regex } });
    const response = createSuccessResponse(
      `Preferences in category ${category}`,
      preferences,
    );
    return res.status(200).json(response);
  } else {
    const preferences = await Preference.find({});
    const response = createSuccessResponse("Preferences", preferences);
    res.status(200).json(response);
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validatePreferences(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const updates = body.updates;

  const bulkOps: AnyBulkWriteOperation[] = [];

  updates.forEach((update: { key: PreferenceType; value: any }) => {
    bulkOps.push({
      updateOne: {
        filter: { key: update.key },
        update: { $set: { value: update.value } },
        upsert: true,
      },
    });
  });

  if (bulkOps.length > 0) {
    await Preference.bulkWrite(bulkOps);
  }

  const updatedPreferences = await Preference.find({});
  const response = createSuccessResponse(
    "Updated Preferences",
    updatedPreferences,
  );
  res.status(200).json(response);
};
