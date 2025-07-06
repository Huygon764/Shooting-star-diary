import express from 'express';

// Import route modules
import entryRoutes from './entries.js';
import userRoutes from './users.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '🌟 Shooting Star Diary API is running!',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API information endpoint
router.get('/', (req, res) => {
  res.json({
    message: '✨ Welcome to Shooting Star Diary API! ✨',
    version: '1.0.0',
    endpoints: {
      'Health Check': 'GET /api/health',
      'Entries': {
        'GET /api/entries': 'Get all entries',
        'POST /api/entries': 'Create new entry',
        'GET /api/entries/:id': 'Get entry by ID',
        'PUT /api/entries/:id': 'Update entry by ID',
        'DELETE /api/entries/:id': 'Delete entry by ID',
        'GET /api/entries/user/:userId': 'Get entries by user'
      },
      'Users': {
        'POST /api/users/register': 'Register new user (username, password)',
        'POST /api/users/login': 'Login user (username, password)',
        'GET /api/users/profile': 'Get user profile (auth required)',
        'PUT /api/users/profile': 'Update user profile (auth required)',
        'PUT /api/users/password': 'Change password (auth required)',
        'DELETE /api/users/account': 'Delete account (auth required)',
        'GET /api/users/all': 'Get all users (admin only)'
      }
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Some endpoints require authentication'
    }
  });
});

// Mount route modules
router.use('/entries', entryRoutes);
router.use('/users', userRoutes);

export default router;
