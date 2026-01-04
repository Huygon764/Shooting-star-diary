import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { env } from "../config/index.js";
import { User } from "../models/index.js";
import { telegramService } from "../services/telegramService.js";
import {
  catchAsync,
  sendSuccess,
  badRequest,
  unauthorized,
} from "../utils/index.js";
import { MESSAGES } from "../constants/index.js";
import type { RegisterDto, LoginDto } from "../types/index.js";

/**
 * Register new user
 * POST /api/users/register
 * Requires: authenticate + requireAdmin
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, password, displayName } = req.body as RegisterDto;

  // Check if user already exists
  const existingUser = await User.findByUsername(username);
  if (existingUser) {
    throw badRequest(MESSAGES.USER.USERNAME_EXISTS);
  }

  // Create new user
  const newUser = new User({
    username,
    password,
    ...(displayName && { displayName }),
  });

  await newUser.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: newUser._id, username: newUser.username },
    env.jwtSecret,
    { expiresIn: "30d" }
  );

  // Send Telegram notification (non-blocking)
  telegramService.sendUserRegistration(newUser).catch((err) => {
    console.error("Telegram notification failed:", err);
  });

  sendSuccess(res, 201, { user: newUser, token }, MESSAGES.USER.CREATED);
});

/**
 * Login user
 * POST /api/users/login
 * Public
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body as LoginDto;

  if (!username || !password) {
    throw badRequest(MESSAGES.AUTH.CREDENTIALS_REQUIRED);
  }

  // Find user and include password for comparison
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw unauthorized(MESSAGES.AUTH.LOGIN_FAILED);
  }

  // Check if account is active
  if (!user.isActive) {
    throw unauthorized(MESSAGES.AUTH.USER_INACTIVE);
  }

  // Update last login
  await user.updateLastLogin();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id.toString(), username: user.username },
    env.jwtSecret,
    { expiresIn: "30d" }
  );

  // Remove password from response
  user.password = undefined as unknown as string;

  // Send Telegram notification (non-blocking)
  telegramService.sendLoginNotification(user).catch((err) => {
    console.error("Telegram notification failed:", err);
  });

  sendSuccess(res, 200, { user, token }, MESSAGES.AUTH.LOGIN_SUCCESS);
});
