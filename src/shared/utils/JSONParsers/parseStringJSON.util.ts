import { ValidationError } from "@/shared/utils/errorHandler/errors";

export const parseStringJSON = (string: any) => {
  if (typeof string === "string") {
    try {
      const parsedBodyField = JSON.parse(string as string);
      return parsedBodyField;
    } catch (error) {
      throw new ValidationError("Invalid JSON format");
    }
  } else {
    return string;
  }
};
