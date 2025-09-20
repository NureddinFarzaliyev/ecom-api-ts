import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { NotFoundError } from "@/shared/utils/errorHandler/errors";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";

export const getFileController = (req: Request, res: Response) => {
  const { folder, filename } = sanitizeObject(req.params);
  const filePath = path.join(__dirname, "../../../uploads/", folder, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    throw new NotFoundError("File not found");
  }
};
