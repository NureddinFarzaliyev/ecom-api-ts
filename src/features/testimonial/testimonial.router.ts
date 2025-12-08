import {
  createTestimonial,
  deleteTestimonial,
  editTestimonial,
  getAllTestimonial,
  getTestimonialConfig,
} from "@/features/testimonial/testimonial.controller";
import { upload, UploadField } from "@/shared/middlewares/multer.middleware";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { verifyJwtOptional } from "@/shared/middlewares/verifyJwtOptional.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const testimonialRouter = Router();

testimonialRouter.get("/config", errorHandler(getTestimonialConfig));
testimonialRouter.get("/", verifyJwtOptional, errorHandler(getAllTestimonial));
testimonialRouter.post(
  "/",
  verifyJwt,
  verifyAdmin,
  upload.single(UploadField.TestimonialImage),
  errorHandler(createTestimonial),
);
testimonialRouter.patch(
  "/:id",
  verifyJwt,
  verifyAdmin,
  upload.single(UploadField.TestimonialImage),
  errorHandler(editTestimonial),
);
testimonialRouter.delete(
  "/:id",
  verifyJwt,
  verifyAdmin,
  errorHandler(deleteTestimonial),
);
