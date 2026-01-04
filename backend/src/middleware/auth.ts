import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { env } from '../config/index.js';
import { User } from '../models/index.js';
import { catchAsync, unauthorized, forbidden } from '../utils/index.js';
import { MESSAGES } from '../constants/index.js';
import type { JwtPayload } from '../types/index.js';

/**
 * Authentication middleware - requires valid token
 */
export const authenticate: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw unauthorized(MESSAGES.AUTH.TOKEN_REQUIRED);
  }

  const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
  const user = await User.findById(decoded.userId);

  if (!user || !user.isActive) {
    throw unauthorized(MESSAGES.AUTH.TOKEN_INVALID);
  }

  req.user = decoded;
  req.userDoc = user;
  next();
});

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export const optionalAuth: RequestHandler = catchAsync(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = decoded;
        req.userDoc = user;
      }
    } catch {
      // Invalid token, continue without auth
    }
  }

  next();
});

/**
 * Admin only middleware - must be used after authenticate
 */
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.userDoc?.isAdmin) {
    throw forbidden(MESSAGES.AUTH.ADMIN_REQUIRED);
  }
  next();
};
