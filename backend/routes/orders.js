const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getMyOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST /api/orders
router.post('/', protect, createOrder);

// @route   GET /api/orders/myorders
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders/:id
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/pay
router.put('/:id/pay', protect, updateOrderToPaid);

// @route   PUT /api/orders/:id/deliver
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, admin, updateOrderStatus);

// @route   GET /api/orders
router.get('/', protect, admin, getOrders);

module.exports = router; 