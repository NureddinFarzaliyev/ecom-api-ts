const baseFields: string[] = ["success", "message", "error"];

export const createErrorResponse = <T>(
  message: string,
  error: T,
  extraFields?: object,
) => ({
  success: false,
  message,
  error,
  ...(extraFields &&
    Object.fromEntries(
      Object.entries(extraFields).filter(([key]) => !baseFields.includes(key)),
    )),
});
