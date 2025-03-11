const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/users
router.get('/', protect, admin, getUsers);

// @route   GET /api/users/:id
router.get('/:id', protect, admin, getUserById);

// @route   PUT /api/users/:id
router.put('/:id', protect, admin, updateUser);

// @route   DELETE /api/users/:id
router.delete('/:id', protect, admin, deleteUser);

module.exports = router; 