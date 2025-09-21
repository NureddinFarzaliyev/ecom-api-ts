import {
  createFeedback,
  deleteFeedback,
  editFeedback,
  getFeedbackConfig,
  getFeedbacks,
  getSingleFeedback,
  respondFeedback,
} from "@/features/feedback/feedback.controller";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { verifyJwtOptional } from "@/shared/middlewares/verifyJwtOptional.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const feedbackRouter = Router();

feedbackRouter.get("/config", errorHandler(getFeedbackConfig));
feedbackRouter.get("/", verifyJwt, errorHandler(getFeedbacks));
feedbackRouter.get("/:id", verifyJwt, errorHandler(getSingleFeedback));
feedbackRouter.post("/", verifyJwtOptional, errorHandler(createFeedback));
feedbackRouter.delete("/:id", verifyJwt, errorHandler(deleteFeedback));
feedbackRouter.patch("/:id", verifyJwt, errorHandler(editFeedback));
feedbackRouter.patch(
  "/:id/response",
  verifyJwt,
  verifyAdmin,
  errorHandler(respondFeedback),
);
