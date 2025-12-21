import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { sanitizeFilename } from "@/shared/utils/sanitizer/sanitizer.util";

export enum UploadField {
  ProductImage = "productImage",
  PreferencesImage = "preferencesImage",
  CustomOrderImage = "customOrderImage",
  SalesCampaignImage = "salesCampaignImage",
  TestimonialImage = "testimonialImage",
  PartnerImage = "partnerImage",
}

export const fileLimitMB = 10;
const fileSize = fileLimitMB * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder = "uploads/others";

    switch (file.fieldname) {
      case UploadField.ProductImage:
        folder = "uploads/products";
        break;
      case UploadField.PreferencesImage:
        folder = "uploads/preferences";
        break;
      case UploadField.CustomOrderImage:
        folder = "uploads/customOrders";
        break;
      case UploadField.SalesCampaignImage:
        folder = "uploads/salesCampaigns";
        break;
      case UploadField.TestimonialImage:
        folder = "uploads/testimonials";
        break;
      case UploadField.PartnerImage:
        folder = "uploads/partnerImage";
        break;
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);

    const safeName = sanitizeFilename(base);
    cb(null, `${safeName}-${Date.now()}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize },
});
