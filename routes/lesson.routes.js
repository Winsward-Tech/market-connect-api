import express from 'express';
import {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lesson.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getLessons);
router.get('/:id', getLesson);

// Protected routes
router.use(protect);

// Admin only routes
router.route('/')
  .post(authorize('admin'), createLesson);

router.route('/:id')
  .put(authorize('admin'), updateLesson)
  .delete(authorize('admin'), deleteLesson);

export default router; 