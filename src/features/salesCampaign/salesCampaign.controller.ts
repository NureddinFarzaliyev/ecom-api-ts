import { Product } from "@/features/product/product.schema";
import {
  SalesCampaign,
  validateCreateSalesCampaign,
  validateEditSalesCampaign,
} from "@/features/salesCampaign/salesCampaign.schema";
import { UploadField } from "@/shared/middlewares/multer.middleware";
import { toBool } from "@/shared/utils/converters/toBool";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { deleteFiles } from "@/shared/utils/files/deleteFiles.util";
import { parseStringJSON } from "@/shared/utils/JSONParsers/parseStringJSON.util";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const getSalesCampaignConfig = async (_req: Request, res: Response) => {
  const response = createSuccessResponse("Config fetched successfully", {
    uploadFieldName: UploadField.SalesCampaignImage,
  });
  res.status(200).json(response);
};

export const getSalesCampaigns = async (req: Request, res: Response) => {
  const queryParams = sanitizeObject(req.query);
  const queryPage = queryParams.page || 1;
  const queryLimit = queryParams.limit || 10;
  const queryHighlighted = queryParams.highlighted || false;

  const findQuery: any = {};
  if (queryHighlighted) {
    findQuery.isHighlighted = true;
  }

  const { results: campaigns, paginationData } = await paginate(
    SalesCampaign,
    findQuery,
    {
      page: queryPage,
      limit: queryLimit,
      populate: [{ path: "products" }],
    },
  );

  const response = createSuccessResponse(
    "Sales campaigns fetched successfully",
    campaigns,
    { paginationData },
  );
  res.json(response);
};

export const getSingleSalesCampaign = async (req: Request, res: Response) => {
  const campaign = await SalesCampaign.findById(req.params.id).populate(
    "products",
  );
  if (!campaign) {
    throw new NotFoundError("Sales campaign not found");
  }
  const response = createSuccessResponse(
    "Sales campaign fetched successfully",
    campaign,
  );
  res.json(response);
};

export const createSalesCampaign = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);

  if (!req.file) {
    throw new ValidationError("Banner image is required");
  }
  body.banner = req.file.path;

  if (toBool(body.isHighlighted) == true) {
    const existingHighlight = await SalesCampaign.findOne({
      isHighlighted: true,
    });
    if (existingHighlight) {
      throw new ValidationError(
        "Another sales campaign is already highlighted",
      );
    }
  }

  const parsedProducts =
    typeof body.products === "string"
      ? parseStringJSON(body.products)
      : body.products;

  body.products = parsedProducts;

  if (Array.isArray(body.products)) {
    body.products = [...new Set(body.products)];
  }

  const products = await Product.find({ _id: { $in: body.products } });
  if (products.length !== body.products.length) {
    throw new ValidationError("One or more products are invalid");
  }

  const { error } = validateCreateSalesCampaign(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const campaign = new SalesCampaign(body);
  const result = await campaign.save();
  const response = createSuccessResponse(
    "Sales campaign created successfully",
    result,
  );
  res.status(201).json(response);
};

export const editSalesCampaign = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateEditSalesCampaign(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const campaign = await SalesCampaign.findById(req.params.id);
  if (!campaign) {
    throw new NotFoundError("Sales campaign not found");
  }

  if (req.file) {
    body.banner = req.file.path;
  }

  if (toBool(body.isHighlighted) == true) {
    const existingHighlight = await SalesCampaign.findOne({
      isHighlighted: true,
    });
    if (existingHighlight) {
      throw new ValidationError(
        "Another sales campaign is already highlighted",
      );
    }
  }

  if (body.products) {
    const parsedProducts =
      typeof body.products === "string"
        ? parseStringJSON(body.products)
        : body.products;
    body.products = parsedProducts;

    if (Array.isArray(body.products)) {
      body.products = [...new Set(body.products)];
    }

    const products = await Product.find({ _id: { $in: body.products } });
    if (products.length !== body.products.length) {
      throw new ValidationError("One or more products are invalid");
    }
  }

  Object.assign(campaign, body);
  const result = await campaign.save();
  const response = createSuccessResponse(
    "Sales campaign updated successfully",
    result,
  );
  res.json(response);
};

export const deleteSalesCampaign = async (req: Request, res: Response) => {
  const campaign = await SalesCampaign.findById(req.params.id);
  if (!campaign) {
    throw new NotFoundError("Sales campaign not found");
  }

  await deleteFiles([campaign.banner]);

  const result = await campaign.deleteOne();
  const response = createSuccessResponse(
    "Sales campaign deleted successfully",
    result,
  );
  res.status(200).json(response);
};
