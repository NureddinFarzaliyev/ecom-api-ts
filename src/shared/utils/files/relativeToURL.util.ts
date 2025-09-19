export const relativeToURL = (filePath: string): string => {
  const url = filePath.replace("uploads", `${process.env.BASE_URL}/files`);
  return url;
};
