const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Admin login
// Add console logs to debug the admin login process
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    console.log('Admin login attempt:', { email });
    console.log('ENV Admin Email:', process.env.ADMIN_EMAIL);
    // Don't log the actual password, just log if it exists
    console.log('Password provided:', !!password);
    console.log('ENV Admin Password exists:', !!process.env.ADMIN_PASSWORD);
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Check if credentials match
    if (email === adminEmail && password === adminPassword) {
        console.log('Admin credentials match, generating token');
        // Generate JWT token
        const token = Jwt.sign(
            { id: 'admin', email, role: 'admin' },
            process.env.JWT_SECRET || "1921u0030",
            { expiresIn: "1h" }
        );
        
        res.status(200).json({
            role: 'admin',
            email: adminEmail,
            token
        });
    } else {
        console.log('Admin credentials do not match');
        res.status(401).json({
            message: 'Invalid admin credentials'
        });
    }
});

// Get all users (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
});

// Delete user (admin only)
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({
        message: 'User deleted successfully'
    });
});

module.exports = { adminLogin, getAllUsers, deleteUser };