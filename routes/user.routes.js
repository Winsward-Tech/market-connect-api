import express from 'express';
import {
  getUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  getAllUsers
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.get('/role/:role', authorize('admin'), getUsersByRole);
router.get('/', authorize('admin'), getAllUsers);

// User routes
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router; 