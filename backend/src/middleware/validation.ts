import { body, param, query } from 'express-validator';

export const validateRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Display name cannot exceed 50 characters'),
];

export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateUpdateProfile = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Display name cannot exceed 50 characters'),
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Bio cannot exceed 200 characters'),
  body('profile.theme')
    .optional()
    .isIn(['default', 'dark', 'light', 'cosmic'])
    .withMessage('Invalid theme'),
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

export const validateCreateEntry = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 2000 })
    .withMessage('Content cannot exceed 2000 characters'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid userId format'),
];

export const validateUpdateEntry = [
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ max: 2000 })
    .withMessage('Content cannot exceed 2000 characters'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
];

export const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];
