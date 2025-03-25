const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if authorization header exists and starts with Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (remove 'Bearer ' prefix)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "1921u0030");

            // Get user from the token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            // Call next middleware
            next();
        } catch (error) {
            console.error('Authentication error:', error);
            
            // Provide specific message for token expiration
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    message: 'Your session has expired. Please login again.' 
                });
            }
            
            // Handle other token errors
            return res.status(401).json({ 
                message: 'Not authorized, invalid token' 
            });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
});

module.exports = protect;