export const generateUserCode = () => {
  return `${Date.now()}${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join("")}`;
};
