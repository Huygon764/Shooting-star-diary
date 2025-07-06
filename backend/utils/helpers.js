import crypto from 'crypto';

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash string using SHA256
const hashString = (string) => {
  return crypto.createHash('sha256').update(string).digest('hex');
};

// Generate JWT payload
const createJWTPayload = (user) => {
  return {
    userId: user._id,
    username: user.username
  };
};

// Format date for Vietnamese locale
const formatVietnameseDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Create pagination metadata
const createPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

// API response formatter
const createApiResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  
  return response;
};

// Error response formatter
const createErrorResponse = (message, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (errors !== null) response.errors = errors;
  
  return response;
};

export {
  generateRandomString,
  hashString,
  createJWTPayload,
  formatVietnameseDate,
  sanitizeInput,
  isValidObjectId,
  createPaginationMeta,
  createApiResponse,
  createErrorResponse
};
