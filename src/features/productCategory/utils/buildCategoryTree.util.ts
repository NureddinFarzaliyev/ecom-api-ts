import { IProductCategory } from "@/features/productCategory/productCategory.types";
import { HydratedDocument } from "mongoose";

export const buildCategoryTree = (
  categories: HydratedDocument<IProductCategory>[],
) => {
  const map = new Map<string, any>();
  const roots: any[] = [];

  categories.forEach((cat) => {
    map.set(cat._id.toString(), { ...cat.toObject(), children: [] });
  });

  categories.forEach((cat) => {
    if (cat.parentId) {
      const parent = map.get(cat.parentId.toString());
      if (parent) parent.children.push(map.get(cat._id.toString()));
    } else {
      roots.push(map.get(cat._id.toString()));
    }
  });

  return roots;
};
