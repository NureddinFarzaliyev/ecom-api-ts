import {
  InstalmentRequest,
  validateInstalmentRequestStatusUpdate,
} from "@/features/instalmentRequest/instalmentRequest.schema";
import { NotificationType } from "@/features/notification/notification.types";
import { createNotification } from "@/features/notification/utils/createNotification.util";
import { UserRole } from "@/features/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { excludeFromUser } from "@/shared/utils/population/excludeFromUser.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const getInstalmentRequests = async (req: Request, res: Response) => {
  const queryParams = sanitizeObject(req.query);
  const queryPage = queryParams.page || 1;
  const queryLimit = queryParams.limit || 10;

  const { userRole, userId } = req;
  const findQuery: any = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery.userId = userId;
  }

  const { results: instalments, paginationData } = await paginate(
    InstalmentRequest,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
      populate: [
        { path: "userId", select: excludeFromUser },
        { path: "orderId" },
      ],
    },
  );

  const response = createSuccessResponse(
    "Instalment requests retrieved successfully",
    instalments,
    { paginationData },
  );
  return res.status(200).json(response);
};

export const getSingleInstalmentRequest = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { userRole, userId } = req;
  let findQuery: any = { _id: id };

  if (userRole !== UserRole.ADMIN) {
    findQuery.userId = userId;
  }

  const instalmentRequest = await InstalmentRequest.findById(id)
    .populate({ path: "userId", select: excludeFromUser })
    .populate({ path: "orderId" });
  if (!instalmentRequest) {
    return res
      .status(404)
      .json({ message: "Instalment request not found", data: null });
  }

  const response = createSuccessResponse(
    "Instalment request retrieved successfully",
    instalmentRequest,
  );
  return res.status(200).json(response);
};

export const changeInstalmentRequestStatus = async (
  req: Request,
  res: Response,
) => {
  const body = sanitizeObject(req.body);
  const { error } = validateInstalmentRequestStatusUpdate(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { id } = req.params;
  const instalmentRequest = await InstalmentRequest.findById(id);
  if (!instalmentRequest) {
    throw new NotFoundError("Instalment request not found");
  }

  if (instalmentRequest.status !== "pending") {
    throw new ValidationError(
      "Only instalment requests with pending status can be updated",
    );
  }

  instalmentRequest.status = body.status!;
  const result = await instalmentRequest.save();

  let type;
  switch (body.status) {
    case "approved":
      type = NotificationType.SUCCESS;
      break;
    case "rejected":
      type = NotificationType.FAIL;
      break;
    default:
      type = NotificationType.INFO;
  }

  const notificationBody = {
    userId: instalmentRequest.userId!.toString(),
    title: "instalment status changed",
    content: `Your instalment request has been changed to: ${body.status}`,
    type,
  };

  await createNotification(notificationBody);

  const response = createSuccessResponse(
    "Instalment request status updated successfully",
    result,
  );
  return res.status(200).json(response);
};
