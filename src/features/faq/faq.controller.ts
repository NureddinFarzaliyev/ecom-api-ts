import {
  Faq,
  validateCreateFaq,
  validatePatchFaq,
} from "@/features/faq/faq.schema";
import { IFaq } from "@/features/faq/faq.types";
import { UserRole } from "@/features/user/user.types";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { extractPaginationQueries } from "@/shared/utils/pagination/extractPaginationQueries";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const getAllFaq = async (req: Request, res: Response) => {
  const { queryPage, queryLimit } = extractPaginationQueries(req.query);
  const { userRole } = req;

  let findQuery = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery = { isActive: true };
  }

  const { results: faq, paginationData } = await paginate(Faq, findQuery, {
    page: queryPage,
    limit: queryLimit,
  });

  const response = createSuccessResponse("Faq data", faq, {
    paginationData,
  });
  res.status(200).json(response);
};

export const createFaq = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateCreateFaq(body as IFaq);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const faq = new Faq(body);
  await faq.save();

  const response = createSuccessResponse("FAQ created", faq);
  res.status(201).json(response);
};

export const patchFaq = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = sanitizeObject(req.body);
  const { error } = validatePatchFaq(body as IFaq);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const faq = await Faq.findById(id);
  if (!faq) {
    throw new NotFoundError("FAQ Not Found");
  }

  Object.assign(faq, body);
  const result = await faq.save();
  const response = createSuccessResponse("FAQ Patched Successfully", result);
  res.status(200).json(response);
};

export const deleteFaq = async (req: Request, res: Response) => {
  const { id } = req.params;

  const faq = await Faq.findOneAndDelete({ _id: id });
  if (!faq) {
    throw new NotFoundError("FAQ Not found");
  }

  const response = createSuccessResponse("Success deleted", faq);
  res.status(200).json(response);
};
