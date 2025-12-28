import { IPartner } from "@/features/partner/partner.types";
import {
  fileLimitMB,
  UploadField,
} from "@/shared/middlewares/multer.middleware";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";
import {
  Partner,
  validateCreatePartner,
  validateEditPartner,
} from "@/features/partner/partner.schema";
import { deleteFiles } from "@/shared/utils/files/deleteFiles.util";
import { extractPaginationQueries } from "@/shared/utils/pagination/extractPaginationQueries";

export const getPartnerConfig = (_: Request, res: Response) => {
  const config = {
    uploadFieldName: UploadField.PartnerImage,
    fileLimitMB,
  };

  const response = createSuccessResponse("Partner config", config);
  res.status(200).json(response);
};

export const getAllPartner = async (req: Request, res: Response) => {
  const { queryPage, queryLimit } = extractPaginationQueries(req.query);

  const { results: testimonial, paginationData } = await paginate(
    Partner,
    {},
    {
      page: queryPage,
      limit: queryLimit,
    },
  );

  const response = createSuccessResponse("Partner data", testimonial, {
    paginationData,
  });
  res.status(200).json(response);
};

export const createPartner = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);

  if (!req.file) {
    throw new ValidationError("Partner image is required");
  }
  body.imageUrl = req.file.path;

  const { error } = validateCreatePartner(body as IPartner);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const p = new Partner(body);
  await p.save();

  const response = createSuccessResponse("Partner created", p);
  res.status(201).json(response);
};

export const editPartner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = sanitizeObject(req.body);

  if (req.file) {
    body.imageUrl = req.file.path;
  }

  const { error } = validateEditPartner(body as IPartner);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const p = await Partner.findById(id);
  if (!p) {
    throw new NotFoundError("Partner Not Found");
  }

  if (req.file && p.imageUrl) {
    await deleteFiles([p.imageUrl]);
  }

  Object.assign(p, body);
  const result = await p.save();
  const response = createSuccessResponse(
    "Partner Patched Successfully",
    result,
  );
  res.status(200).json(response);
};

export const deletePartner = async (req: Request, res: Response) => {
  const { id } = req.params;

  const p = await Partner.findOneAndDelete({ _id: id });
  if (!p) {
    throw new NotFoundError("Partner Not found");
  }

  await deleteFiles([p.imageUrl]);

  const response = createSuccessResponse("Partner deleted successfully");
  res.status(200).json(response);
};
