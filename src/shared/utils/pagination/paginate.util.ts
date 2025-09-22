import { Model, FilterQuery, SortValues, PopulateOptions } from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, SortValues>;
  populate?: PopulateOptions | (string | PopulateOptions)[];
}

export async function paginate<T>(
  model: Model<T>,
  query: FilterQuery<T>,
  options: PaginationOptions = {},
) {
  const page = options.page && options.page > 0 ? options.page : 1;
  const limit = options.limit && options.limit > 0 ? options.limit : 10;
  const skip = (page - 1) * limit;
  const sort = options.sort;

  const [results, total] = await Promise.all([
    model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(options.populate || []),
    model.countDocuments(query),
  ]);

  return {
    results,
    paginationData: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}
