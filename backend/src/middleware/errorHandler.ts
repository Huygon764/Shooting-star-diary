import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/index.js';
import { sendError } from '../utils/responseHelper.js';
import { MESSAGES } from '../constants/index.js';
import { env } from '../config/index.js';

interface MongooseValidationError extends Error {
  name: 'ValidationError';
  errors: Record<string, { message: string }>;
}

interface MongooseCastError extends Error {
  name: 'CastError';
}

interface MongooseDuplicateKeyError extends Error {
  code: number;
}

const isValidationError = (error: Error): error is MongooseValidationError => {
  return error.name === 'ValidationError';
};

const isCastError = (error: Error): error is MongooseCastError => {
  return error.name === 'CastError';
};

const isDuplicateKeyError = (error: Error): error is MongooseDuplicateKeyError => {
  return (error as MongooseDuplicateKeyError).code === 11000;
};

const isJwtError = (error: Error): boolean => {
  return error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError';
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Log error in development
  if (env.nodeEnv === 'development') {
    console.error('❌ Error:', err);
  } else {
    console.error('❌ Error:', err.message);
  }

  // Handle AppError (operational errors)
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  // Handle Mongoose validation error
  if (isValidationError(err)) {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, MESSAGES.COMMON.VALIDATION_ERROR, errors);
  }

  // Handle Mongoose cast error (invalid ObjectId)
  if (isCastError(err)) {
    return sendError(res, 400, MESSAGES.COMMON.INVALID_ID);
  }

  // Handle MongoDB duplicate key error
  if (isDuplicateKeyError(err)) {
    return sendError(res, 400, MESSAGES.COMMON.DUPLICATE_FIELD);
  }

  // Handle JWT errors
  if (isJwtError(err)) {
    return sendError(res, 401, MESSAGES.AUTH.TOKEN_INVALID);
  }

  // Handle unknown errors
  return sendError(res, 500, MESSAGES.COMMON.SERVER_ERROR);
};
