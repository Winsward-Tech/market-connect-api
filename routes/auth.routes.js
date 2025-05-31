import express from 'express';
import { register, login, getMe, forgotPin, resetPin } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-pin', forgotPin);
router.post('/reset-pin', resetPin);

// Protected routes
router.get('/me', protect, getMe);

export default router; 