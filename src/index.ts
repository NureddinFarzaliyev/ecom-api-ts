import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocsV1 from "@/shared/tools/swagger";
import userRouter from "@/features/user/user.router";

// App
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocsV1));

// Routes
app.get("/", (_, res) => {
  res.send("Hello, World! - deploy test successful");
});

app.use("/user", userRouter);

// Initialize
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
