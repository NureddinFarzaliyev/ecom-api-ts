import { logger } from "@/shared/tools/logger";
import fs from "fs/promises";

export const deleteFiles = async (filePaths: string[]) => {
  if (filePaths.length === 0) return;
  await Promise.all(
    filePaths.map(async (path) => {
      try {
        await fs.unlink(path);
      } catch (err) {
        logger.error(`Failed to delete file at ${path}:`, err);
      }
    }),
  );
};
