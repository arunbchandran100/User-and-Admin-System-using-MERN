const express = require('express');
const router = express.Router();
const { signupUser, loginUser, logoutUser, updateUserProfile } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.put('/update-profile', protect, updateUserProfile);

module.exports = router;