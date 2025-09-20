import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { apiKeyMiddleware } from "./middleware/auth";
import { setupSwagger } from "./config/swagger";
import { initEndpointModel } from "./models/Endpoint";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "mock_server_db",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api", apiKeyMiddleware);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Initialize models
    initEndpointModel(sequelize);
    console.log("Models initialized");

    await sequelize.sync();
    console.log("Database synchronized");

    // Import and register routes after database connection
    const { registerRoutes } = await import("./routes");
    registerRoutes(app);

    // Add 404 handler after all routes
    app.use("*", (req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
