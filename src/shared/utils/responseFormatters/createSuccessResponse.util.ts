const baseFields: string[] = ["success", "message", "data"];

export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  extraFields?: object,
) => ({
  success: true,
  message,
  data: data ?? null,
  ...(extraFields &&
    Object.fromEntries(
      Object.entries(extraFields).filter(([key]) => !baseFields.includes(key)),
    )),
});
