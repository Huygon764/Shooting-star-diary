import express from "express";
import cors from "cors";
import { env, connectDb } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { sendError } from "./utils/index.js";
import { telegramBot } from "./services/telegramBot.js";

const app = express();

// Connect to MongoDB
connectDb();

// CORS
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (env.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use("/api", apiRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✨ Welcome to Shooting Star Diary API! ✨",
    version: "2.0.0",
    documentation: "/api",
    health: "/api/health",
  });
});

// 404 handler
app.use("*", (req, res) => {
  sendError(res, 404, "Endpoint không tồn tại");
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(env.port, () => {
  console.log(`🚀 Server is running on http://localhost:${env.port}`);

  telegramBot.launch();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});

export default app;
