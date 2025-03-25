const express = require('express');
const router = express.Router();
const { signupUser, loginUser, logoutUser, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes
// This is likely where the error is - make sure updateUserProfile is a function
router.put('/update-profile', protect, updateUserProfile);

module.exports = router;