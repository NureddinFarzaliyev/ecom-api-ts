import { createResponseJSON } from "@/shared/utils/createResponseJSON/createResponseJSON.util";
import { Request, Response } from "express";

export const getUser = (_req: Request, res: Response) => {
  const response = createResponseJSON(true, "User Route is functional");
  res.status(200).json(response);
};
