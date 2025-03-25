const express = require('express');
const router = express.Router();
const { adminLogin, getAllUsers, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin login route
router.post('/login', adminLogin);

// Protected admin routes
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:userId', protect, adminOnly, deleteUser);

module.exports = router;