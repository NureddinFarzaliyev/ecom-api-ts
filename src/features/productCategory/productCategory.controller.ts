import { Product } from "@/features/product/product.schema";
import {
  ProductCategory,
  validateCreateProductCategory,
  validateEditProductCategory,
} from "@/features/productCategory/productCategory.schema";
import { buildCategoryTree } from "@/features/productCategory/utils/buildCategoryTree.util";
import {
  NotFoundError,
  ValidationError,
} from "@/shared/utils/errorHandler/errors";
import { createSuccessResponse } from "@/shared/utils/responseFormatters/createSuccessResponse.util";
import { sanitizeObject } from "@/shared/utils/sanitizer/sanitizer.util";
import { Request, Response } from "express";

export const fetchAllProductCategories = async (
  _req: Request,
  res: Response,
) => {
  const categories = await ProductCategory.find();
  const categoryTree = buildCategoryTree(categories);
  const response = createSuccessResponse("", categoryTree);
  res.status(200).json(response);
};

export const getProductCategoryTitles = async (
  _req: Request,
  res: Response,
) => {
  const categories = await ProductCategory.find({}).select("title parentId");
  const tree = buildCategoryTree(categories);
  const response = createSuccessResponse("Category titles", tree);
  res.json(response);
};

export const createProductCategory = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateCreateProductCategory(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { parentId } = body;

  if (parentId) {
    const doesParentExist = await ProductCategory.findOne({ _id: parentId });
    if (!doesParentExist) {
      throw new ValidationError("Parent category does not exist");
    }
  }

  const productCategory = new ProductCategory(req.body);
  const result = await productCategory.save();

  const response = createSuccessResponse("Product Category Created", result);
  res.status(201).json(response);
};

export const editProductCategory = async (req: Request, res: Response) => {
  const body = sanitizeObject(req.body);
  const { error } = validateEditProductCategory(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  const { id } = req.params;
  const { parentId } = body;

  if (parentId) {
    const doesParentExist = await ProductCategory.findOne({ _id: parentId });
    if (!doesParentExist) {
      throw new ValidationError("Parent category does not exist");
    }
  }

  const updatedCategory = await ProductCategory.findByIdAndUpdate(
    id,
    req.body,
    { new: true },
  );
  if (!updatedCategory) {
    throw new NotFoundError("Product Category not found");
  }

  const response = createSuccessResponse(
    "Product Category Updated",
    updatedCategory,
  );
  res.status(200).json(response);
};

export const deleteProductCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const hasChildren = await ProductCategory.exists({ parentId: id });
  if (hasChildren) {
    throw new ValidationError(
      "Cannot delete category with existing subcategories",
    );
  }

  const hasProducts = await Product.exists({ category: id });
  if (hasProducts) {
    throw new ValidationError("Cannot delete category with existing products");
  }

  const deletedCategory = await ProductCategory.findByIdAndDelete(id);
  if (!deletedCategory) {
    throw new NotFoundError("Product Category not found");
  }

  const response = createSuccessResponse(
    "Product Category Deleted",
    deletedCategory,
  );
  res.status(200).json(response);
};
