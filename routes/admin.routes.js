import express from 'express';
import {
  getOverview,
  getReports
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getOverview);
router.get('/reports', getReports);

export default router; 