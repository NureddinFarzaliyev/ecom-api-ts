import {
  InstalmentRequest,
  validateCreateInstalmentRequest,
} from "@/features/instalmentRequest/instalmentRequest.schema";
import { Preference } from "@/features/preferences/preference.schema";
import { PreferenceCategory } from "@/features/preferences/preference.types";
import { ValidationError } from "@/shared/utils/errorHandler/errors";
import { generateNanoIdToken } from "@/shared/utils/tokens/nanoidToken.util";
import { ClientSession } from "mongoose";

interface RequestDetails {
  userId: string | null;
  orderId: string;
  fin: string;
  totalPrice: number;
  months: number;
}

export const createInstalmentRequest = async (
  requestDetails: RequestDetails,
  session?: ClientSession,
) => {
  const { error } = validateCreateInstalmentRequest(requestDetails);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const code = `IR-${generateNanoIdToken()}`;

  const commisionRate = await Preference.findOne({
    key: `${PreferenceCategory.instalment}:${requestDetails.months}`,
  });
  if (!commisionRate) {
    throw new ValidationError(
      "Invalid instalment months or commision rate not defined",
    );
  }

  const instalmentRequest = new InstalmentRequest({
    ...requestDetails,
    commissionRate: commisionRate.value,
    code,
  });
  await instalmentRequest.save({ session });
  return instalmentRequest;
};
