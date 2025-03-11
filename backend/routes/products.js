const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/products
router.get('/', getProducts);

// @route   GET /api/products/top
router.get('/top', getTopProducts);

// @route   GET /api/products/featured
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/:id
router.get('/:id', getProductById);

// @route   POST /api/products
router.post('/', protect, admin, createProduct);

// @route   PUT /api/products/:id
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
router.delete('/:id', protect, admin, deleteProduct);

// @route   POST /api/products/:id/reviews
router.post('/:id/reviews', protect, createProductReview);

module.exports = router; 