import express from 'express';
import entryController from '../controllers/entryController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateEntryCreation, validateEntryUpdate } from '../middleware/validation.js';

const router = express.Router();

// Public routes (with optional auth for future features)
router.get('/', optionalAuth, entryController.getAllEntries);
router.get('/:id', optionalAuth, entryController.getEntryById);

// Protected routes (require authentication when users are implemented)
router.post('/', validateEntryCreation, entryController.createEntry);
router.put('/:id', validateEntryUpdate, entryController.updateEntry);
router.delete('/:id', entryController.deleteEntry);

// User-specific routes
router.get('/user/:userId', optionalAuth, entryController.getEntriesByUser);

export default router;
