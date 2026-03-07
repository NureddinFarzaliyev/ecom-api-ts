import {
  Product,
  validateCreateProduct,
  validateEditProduct,
} from "@/features/product/product.schema";
import { ProductQueries } from "@/features/product/product.types";
import { ProductCategory } from "@/features/productCategory/productCategory.schema";
import { UserRole } from "@/features/user/user.types";
import {
  fileLimitMB,
  UploadField,
} from "@/shared/middlewares/multer.middleware";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { deleteFiles } from "@/shared/utils/files/deleteFiles.util";
import { extractPaginationQueries } from "@/shared/utils/pagination/extractPaginationQueries";
import { paginate } from "@/shared/utils/pagination/paginate.util";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import {
  sanitizeObject,
  sanitizeString,
} from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getProductConfig = async (_req: Request, res: Response) => {
  const response = createSuccessResponse("Product config", {
    uploadFieldName: UploadField.ProductImage,
    fileLimitMB,
  });
  res.status(200).json(response);
};

export const getProducts = async (req: Request, res: Response) => {
  const queryParams = sanitizeObject(req.query);
  console.log("query params", queryParams);
  const { queryPage, queryLimit } = extractPaginationQueries(queryParams, true);

  console.log("extracted query limit", queryLimit);

  const { userRole } = req;
  const findQuery: any = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery.isPublic = true;
  }

  const { q, minPrice, maxPrice, priceSort, category }: ProductQueries =
    queryParams;

  if (q) {
    findQuery.$text = { $search: queryParams.q };
  }

  const priceQuery: any = {};

  if (minPrice !== undefined) {
    priceQuery.$gte = Number(minPrice);
  }

  if (maxPrice !== undefined) {
    priceQuery.$lte = Number(maxPrice);
  }

  if (Object.keys(priceQuery).length > 0) {
    findQuery.price = priceQuery;
  }

  if (category) {
    const categories = category.split(",");
    const isValid = categories.every((c) => mongoose.Types.ObjectId.isValid(c));
    if (isValid) {
      findQuery.category = { $in: categories };
    }
  }

  const sort: any = {};

  const priceSortVal = Number(priceSort);
  if (priceSortVal === 1 || priceSortVal === 0) {
    sort.price = priceSortVal === 1 ? 1 : -1;
  }

  console.log("query limit given in paginate function", queryLimit);

  const { results: products, paginationData: pagination } = await paginate(
    Product,
    findQuery,
    { page: queryPage, limit: queryLimit, populate: ["category"], sort },
  );

  const response = createSuccessResponse(
    "Products retrieved successfully",
    products,
    { pagination },
  );

  res.status(200).json(response);
};

export const getProductTitles = async (req: Request, res: Response) => {
  const { userRole } = req;

  const findQuery: any = {};
  if (userRole !== UserRole.ADMIN) {
    findQuery.isPublic = false;
  }

  const products = await Product.find(findQuery).select("title");

  const response = createSuccessResponse("All product titles", products);
  res.json(response);
};

export const getSingleProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(
    sanitizeString(req.params.id),
  ).populate("category");
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  const response = createSuccessResponse(
    "Product retrieved successfully",
    product,
  );
  res.status(200).json(response);
};

export const createProduct = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateCreateProduct(sanitizeObject(body));
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const category = await ProductCategory.exists({ _id: body.category });
  if (!category) {
    throw new ValidationError("Invalid product category");
  }

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    throw new ValidationError("At least one product image is required");
  }
  const imagePaths = files.map((file) => file.path);

  const product = new Product({ ...body, images: imagePaths });
  const result = await product.save();
  const response = createSuccessResponse(
    "Product created successfully",
    result,
  );
  res.status(201).json(response);
};

export const editProduct = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateEditProduct(sanitizeObject(body));
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (body.category) {
    const category = await ProductCategory.exists({ _id: body.category });
    if (!category) {
      throw new ValidationError("Invalid product category");
    }
  }

  const files = req.files as Express.Multer.File[];

  if (files && files.length > 0 && !body.keepImages) {
    throw new ValidationError(
      "keepImages field is required when modifying images",
    );
  }

  let toDelete: string[] = [];

  if (body.keepImages) {
    const keepImages: string[] = body.keepImages
      ? JSON.parse(body.keepImages)
      : [];
    toDelete = product.images.filter((img) => !keepImages.includes(img));

    let imagePaths: string[] = [];
    if (files && files.length > 0) {
      imagePaths = files.map((file) => file.path);
    }
    product.images = [...keepImages, ...(imagePaths || [])];
  }

  Object.assign(product, body);
  const result = await product.save();

  if (toDelete.length > 0) {
    await deleteFiles(toDelete);
  }

  const response = createSuccessResponse(
    "Product updated successfully",
    result,
  );
  res.status(200).json(response);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new NotFoundError("Product not found");
  }
  await deleteFiles(product.images);
  const response = createSuccessResponse("Product deleted successfully");
  res.status(200).json(response);
};
