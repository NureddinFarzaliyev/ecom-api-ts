import {
  Preference,
  validatePreferences,
} from "@/features/preferences/preference.schema";
import {
  PreferenceCategory,
  PreferenceType,
  PreferenceUpdate,
} from "@/features/preferences/preference.types";
import { findPreferencesByCategory } from "@/features/preferences/util/findPreferencesByCategory.util";
import {
  fileLimitMB,
  UploadField,
} from "@/shared/middlewares/multer.middleware";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
import { parseStringJSON } from "@/shared/utils/JSONParsers/parseStringJSON.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";
import { AnyBulkWriteOperation } from "mongoose";

export const getPreferencesConfig = async (_req: Request, res: Response) => {
  const response = createSuccessResponse("Preferences config", {
    preferences: PreferenceType,
    categories: PreferenceCategory,
    uploadFieldName: UploadField.PreferencesImage,
    fileLimitMB,
  });
  res.status(200).json(response);
};

export const getAllPreferences = async (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  if (category) {
    const preferences = await findPreferencesByCategory(category);
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
  const session = req.session;
  const body = sanitizeObject(req.body);
  const { error } = validatePreferences(body as PreferenceUpdate);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const updates =
    typeof body.updates === "string"
      ? parseStringJSON(body.updates)
      : body.updates;

  const file = req.file as Express.Multer.File | undefined;

  if (file && updates.length !== 1) {
    throw new ValidationError(
      "When uploading a file, only one preference can be updated at a time",
    );
  }

  const bulkOps: AnyBulkWriteOperation[] = [];

  updates.forEach((update: { key: PreferenceType; value: any }) => {
    bulkOps.push({
      updateOne: {
        filter: { key: update.key },
        update: { $set: { value: file ? file.path : update.value } },
        upsert: true,
      },
    });
  });

  if (bulkOps.length > 0) {
    await Preference.bulkWrite(bulkOps, { session, ordered: true });
  }

  const updatedPreferences = await Preference.find({}).session(session ?? null);
  const response = createSuccessResponse(
    "Updated Preferences",
    updatedPreferences,
  );
  res.status(200).json(response);
};
