const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/cart
router.get('/', protect, getCart);

// @route   POST /api/cart
router.post('/', protect, addToCart);

// @route   PUT /api/cart/:itemId
router.put('/:itemId', protect, updateCartItem);

// @route   DELETE /api/cart/:itemId
router.delete('/:itemId', protect, removeFromCart);

// @route   DELETE /api/cart
router.delete('/', protect, clearCart);

module.exports = router; 