import { Router } from "express";
import { validateLogin } from "../middleware/validation.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { login } from "../controllers/userController.js";

const router = Router();

// POST /api/users/login - Public
router.post("/login", validateLogin, validateRequest, login);

export default router;
