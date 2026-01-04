import { Router } from "express";
import usersRouter from "./users.js";
import entriesRouter from "./entries.js";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "✨ Server is healthy!",
    timestamp: new Date().toISOString(),
  });
});

// API info
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "✨ Welcome to Shooting Star Diary API! ✨",
    version: "2.0.0",
  });
});

// Mount routers
router.use("/users", usersRouter);
router.use("/entries", entriesRouter);

export default router;
