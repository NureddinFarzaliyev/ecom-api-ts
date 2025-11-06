import { nanoid } from "nanoid";

export const generateNanoIdToken = (length: number = 8) => {
  return nanoid(length).toUpperCase();
};
