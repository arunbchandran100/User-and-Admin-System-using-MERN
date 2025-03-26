const express = require('express');
const router = express.Router();
const { 
    adminLogin, 
    getAllUsers, 
    deleteUser, 
    createUser, 
    updateUser 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin login route
router.post('/login', adminLogin);

// Protected admin routes
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/users', protect, adminOnly, createUser);
router.delete('/users/:userId', protect, adminOnly, deleteUser);
router.put('/users/:userId', protect, adminOnly, updateUser);

module.exports = router;