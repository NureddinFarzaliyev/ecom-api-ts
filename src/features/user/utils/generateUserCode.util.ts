import { generateTimestampToken } from "@/shared/utils/tokens/timestampToken.util";

export const generateUserCode = () => {
  return generateTimestampToken();
};
