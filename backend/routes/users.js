import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validatePasswordChange 
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, userController.register);
router.post('/login', validateUserLogin, userController.login);

// Protected routes (require authentication)
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/password', authenticate, validatePasswordChange, userController.changePassword);
router.delete('/account', authenticate, userController.deleteAccount);

// Admin routes
router.get('/all', authenticate, requireAdmin, userController.getAllUsers);

export default router;
