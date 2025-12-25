import { Preference } from "@/features/preferences/preference.schema";

export const findPreferencesByCategory = async (category: string) => {
  const regex = new RegExp(`^${category}:\\w+$`, "i");
  const preferences = await Preference.find({ key: { $regex: regex } });
  return preferences;
};
