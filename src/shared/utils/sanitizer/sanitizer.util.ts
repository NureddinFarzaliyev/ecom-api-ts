import sanitizeHtml from "sanitize-html";

export const sanitizeString = (input: string, options = {}) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    ...options,
  });
};

export const sanitizeObject = (obj: Record<string, any>, options = {}) => {
  const clean: Record<string, any> = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "string") {
      clean[key] = sanitizeString(value, options);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      clean[key] = sanitizeObject(value, options);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

export const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9_\-\.]/gi, "_").toLowerCase();
};
