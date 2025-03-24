const express = require('express');
const { signupUser, loginUser } = require('../controllers/userController');
const router = express.Router();

// Define the route for user signup
router.post('/signup', signupUser);

// Define the route for user login
router.post('/login', loginUser);

module.exports = router;