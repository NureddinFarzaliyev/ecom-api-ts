import { logger } from "@/shared/tools/logger";
import { Request } from "express";
import fs from "fs/promises";

export const cleanupFilesInRequest = async (req: Request) => {
  const files = req.files as Express.Multer.File[] | undefined;
  const file = req.file as Express.Multer.File | undefined;

  if (files && Array.isArray(files)) {
    for (const f of files) {
      try {
        await fs.unlink(f.path);
        logger.info(`Deleted leftover file: ${f.path}`);
      } catch (err) {
        logger.warn(`Failed to delete file ${f.path}: ${err}`);
      }
    }
  } else if (file) {
    try {
      await fs.unlink(file.path);
      logger.info(`Deleted leftover file: ${file.path}`);
    } catch (err) {
      logger.warn(`Failed to delete file ${file.path}: ${err}`);
    }
  }
};
