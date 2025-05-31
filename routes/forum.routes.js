import express from 'express';
import {
  getForums,
  getForum,
  createForum,
  updateForum,
  deleteForum,
  addComment,
  updateComment,
  deleteComment
} from '../controllers/forum.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getForums);
router.get('/:id', getForum);

// Protected routes
router.use(protect);

router.route('/')
  .post(createForum);

router.route('/:id')
  .put(updateForum)
  .delete(deleteForum);

// Comment routes
router.post('/:forumId/comments', addComment);
router.route('/comments/:id')
  .put(updateComment)
  .delete(deleteComment);

export default router; 