export const relativeToURL = (filePath: string): string => {
  const url = filePath.replace("uploads", `${process.env.BASE_URL}/files`);
  return url;
};

export const URLToRelative = (url: string): string => {
  const filePath = url.replace(`${process.env.BASE_URL}/files`, "uploads");
  return filePath;
};
