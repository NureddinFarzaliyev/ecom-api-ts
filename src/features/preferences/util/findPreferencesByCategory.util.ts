import { Preference } from "@/features/preferences/preference.schema";
import { PreferenceCategory } from "@/features/preferences/preference.types";
import { ValidationError } from "@/shared/utils/errorHandler/errors";

export const findPreferencesByCategory = async (category: string) => {
  if (
    !Object.values(PreferenceCategory).includes(category as PreferenceCategory)
  ) {
    throw new ValidationError("Invalid category");
  }

  const regex = new RegExp(`^${category}:\\w+$`, "i");
  const preferences = await Preference.find({ key: { $regex: regex } });
  return preferences;
};
