import { body, validationResult } from 'express-validator';

// Validation middleware to check for errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('displayName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Display name cannot exceed 50 characters'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Entry creation validation
const validateEntryCreation = [
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 2000 })
    .withMessage('Content cannot exceed 2000 characters'),
  
  body('mood')
    .optional()
    .isIn(['happy', 'sad', 'excited', 'calm', 'anxious', 'grateful', 'other'])
    .withMessage('Invalid mood value'),
  
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  
  handleValidationErrors
];

// Entry update validation
const validateEntryUpdate = [
  body('content')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Content cannot exceed 2000 characters'),
  
  body('mood')
    .optional()
    .isIn(['happy', 'sad', 'excited', 'calm', 'anxious', 'grateful', 'other'])
    .withMessage('Invalid mood value'),
  
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean'),
  
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  
  handleValidationErrors
];

export {
  validateUserRegistration,
  validateUserLogin,
  validateEntryCreation,
  validateEntryUpdate,
  validatePasswordChange,
  handleValidationErrors
};
