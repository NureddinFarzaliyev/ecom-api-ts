import { ITestimonial } from "@/features/testimonial/testimonial.types";
import {
  Testimonial,
  validateCreateTestimonial,
  validateEditTestimonial,
} from "@/features/testimonial/testimonial.schema";
import { UserRole } from "@/features/user/user.types";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { deleteFiles } from "@/shared/utils/files/deleteFiles.util";
import {
  fileLimitMB,
  UploadField,
} from "@/shared/middlewares/multer.middleware";
import { extractPaginationQueries } from "@/shared/utils/pagination/extractPaginationQueries";

export const getTestimonialConfig = async (_: Request, res: Response) => {
  const config = {
    uploadFieldName: UploadField.TestimonialImage,
    fileLimitMB,
  };

  const response = createSuccessResponse("Testimonial config", config);
  res.status(200).json(response);
};

export const getAllTestimonial = async (req: Request, res: Response) => {
  const { queryPage, queryLimit } = extractPaginationQueries(req.query);
  const { userRole } = req;

  let findQuery = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery = { isActive: true };
  }

  const { results: testimonial, paginationData } = await paginate(
    Testimonial,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
    },
  );

  const response = createSuccessResponse("Testimonial data", testimonial, {
    paginationData,
  });
  res.status(200).json(response);
};

export const createTestimonial = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);

  if (!req.file) {
    throw new ValidationError("Testimonial image is required");
  }
  body.image = req.file.path;

  const { error } = validateCreateTestimonial(body as ITestimonial);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const testimonial = new Testimonial(body);
  await testimonial.save();

  const response = createSuccessResponse("Testimonial created", testimonial);
  res.status(201).json(response);
};

export const editTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = sanitizeObject(req.body);

  if (req.file) {
    body.image = req.file.path;
  }

  const { error } = validateEditTestimonial(body as ITestimonial);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new NotFoundError("Testimonial Not Found");
  }

  if (req.file && testimonial.image) {
    await deleteFiles([testimonial.image]);
  }

  Object.assign(testimonial, body);
  const result = await testimonial.save();
  const response = createSuccessResponse(
    "Testimonial Patched Successfully",
    result,
  );
  res.status(200).json(response);
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findOneAndDelete({ _id: id });
  if (!testimonial) {
    throw new NotFoundError("Testimonial Not found");
  }

  await deleteFiles([testimonial.image]);

  const response = createSuccessResponse("Testimonial deleted successfully");
  res.status(200).json(response);
};
