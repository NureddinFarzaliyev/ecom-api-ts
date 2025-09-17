import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerOptionsV1 = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce Web API",
      version: "1.0.0",
      description: "API documentation for E-Commerce Web",
    },
    servers: [
      { url: "http://localhost:3000" },
      { url: process.env.BASE_URL || "" },
    ],
  },
  apis: [path.join(__dirname, "../../docs/**/*.yaml")],
};

const swaggerDocsV1 = swaggerJSDoc(swaggerOptionsV1);
export default swaggerDocsV1;
