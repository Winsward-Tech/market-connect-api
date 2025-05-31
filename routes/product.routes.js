import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProducts,
  uploadProductImage
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protect all routes
router.use(protect);

// Product routes
router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.get('/user/:id', getUserProducts);
router.post('/upload', upload.single('image'), uploadProductImage);

export default router; 