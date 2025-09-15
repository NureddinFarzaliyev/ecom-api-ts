const baseFields: string[] = ["success", "message", "data"];

export const createResponseJSON = <T>(
  success: boolean,
  message: string,
  data?: T,
  extraFields?: object,
) => ({
  success,
  message,
  data: data ?? null,
  ...(extraFields &&
    Object.fromEntries(
      Object.entries(extraFields).filter(([key]) => !baseFields.includes(key)),
    )),
});
