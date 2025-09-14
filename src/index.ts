import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocsV1 from "@/shared/tools/swagger";
import { v1Router } from "@/features/v1/v1.router";

// App
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocsV1));

// Routes
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Welcome to the API",
    data: null,
  });
});

app.use("/v1", v1Router);

// Initialize
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
