import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

export enum UploadField {
  ProductImage = "productImage",
}

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9_\-\.]/gi, "_").toLowerCase();
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder = "uploads/others";

    if (file.fieldname === UploadField.ProductImage)
      folder = "uploads/products";

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

const upload = multer({ storage, fileFilter });

export default upload;
