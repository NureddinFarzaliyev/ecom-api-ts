import { Document } from "mongoose";

export enum PreferenceType {
  social_ig = "social:ig",
  social_fb = "social:fb",
  social_tw = "social:tw",
  social_tt = "social:tt",
  social_yt = "social:yt",
  service_1 = "service:1",
  service_2 = "service:2",
}

export enum PreferenceCategory {
  social = "social",
  service = "service",
}

export interface IPreference extends Document {
  _id: string;
  key: PreferenceType;
  value: any;
}

export interface PreferenceUpdate {
  updates: string | { key: string; value: string };
}
