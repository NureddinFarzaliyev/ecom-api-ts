import {
  createFaq,
  deleteFaq,
  getAllFaq,
  patchFaq,
} from "@/features/faq/faq.controller";
import { verifyAdmin } from "@/shared/middlewares/verifyAdmin.middleware";
import { verifyJwt } from "@/shared/middlewares/verifyJwt.middleware";
import { verifyJwtOptional } from "@/shared/middlewares/verifyJwtOptional.middleware";
import { errorHandler } from "@/shared/utils/errorHandler/errorHandler";
import { Router } from "express";

export const faqRouter = Router();

faqRouter.get("/", verifyJwtOptional, errorHandler(getAllFaq));
faqRouter.post("/", verifyJwt, verifyAdmin, errorHandler(createFaq));
faqRouter.patch("/:id", verifyJwt, verifyAdmin, errorHandler(patchFaq));
faqRouter.delete("/:id", verifyJwt, verifyAdmin, errorHandler(deleteFaq));
