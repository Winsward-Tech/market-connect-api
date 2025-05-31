import Product from '../models/product.model.js';
import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
});

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('user', 'name phone');
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });   
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'name phone');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price } = req.body;
    const product = await Product.create({
      title,
      description,
      price,
      user: req.user._id
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the product owner
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the product owner
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

// @desc    Get user products
// @route   GET /api/products/user/:id
// @access  Private
export const getUserProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
    }
};

// @desc    Upload product image
// @route   POST /api/products/upload
// @access  Private
export const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream({
      folder: 'market-connect/products',
      resource_type: 'auto'
    }, (error, result) => {
      if (error) {
        return res.status(400).json({ message: 'Error uploading file' });
      }
      res.json({ url: result.secure_url });
    }).end(req.file.buffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
}; 