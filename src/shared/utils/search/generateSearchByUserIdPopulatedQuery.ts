import { User } from "@/features/user/user.schema";
import { escapeRegex } from "@/shared/utils/sanitizer/sanitizer.util";

type GenerateSearchByUserIdPopulatedQuery = (
  query: string,
  additionalFields?: string[],
) => Promise<any>;

export const generateSearchByUserIdPopulatedQuery: GenerateSearchByUserIdPopulatedQuery =
  async (query, additionalFields) => {
    const q = escapeRegex(query);

    const userIds = await User.find({
      $text: { $search: q },
    }).distinct("_id");

    const parts = q.split(" ");
    const guestQueries = [];

    if (parts.length === 2) {
      guestQueries.push({
        $and: [
          { "guest.name": { $regex: parts[0], $options: "i" } },
          { "guest.surname": { $regex: parts[1], $options: "i" } },
        ],
      });
    } else {
      guestQueries.push(
        { "guest.name": { $regex: q, $options: "i" } },
        { "guest.surname": { $regex: q, $options: "i" } },
      );
    }

    const findQuery = {
      $or: [
        ...(additionalFields
          ? additionalFields.map((field) => ({
            [field]: { $regex: q, $options: "i" },
          }))
          : []),
        ...guestQueries,
        ...(userIds.length ? [{ userId: { $in: userIds } }] : []),
      ],
    };

    return findQuery;
  };
