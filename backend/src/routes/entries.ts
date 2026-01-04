import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validateCreateEntry } from "../middleware/validation.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createEntry } from "../controllers/entryController.js";

const router = Router();

// POST /api/entries - Requires authentication
router.post(
  "/",
  authenticate,
  validateCreateEntry,
  validateRequest,
  createEntry
);

export default router;
