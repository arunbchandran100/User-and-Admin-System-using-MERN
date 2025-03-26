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

// Create new user (admin only)
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Please provide all required fields'
        });
    }
    
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Please provide a valid email address'
        });
    }
    
    // Check if password is strong enough
    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long'
        });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            message: 'User with this email already exists'
        });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });
    
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        });
    } else {
        res.status(400).json({
            message: 'Invalid user data'
        });
    }
});

// Update user (admin only)
const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { name, email, password } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    
    // Update fields if provided
    if (name) {
        user.name = name;
    }
    
    if (email) {
        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }
        
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({
                message: 'Email is already in use by another user'
            });
        }
        
        user.email = email;
    }
    
    if (password) {
        // Check if password is strong enough
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }
        
        // Hash password
        user.password = await bcrypt.hash(password, 10);
    }
    
    // Save updated user
    const updatedUser = await user.save();
    
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt
    });
});

module.exports = { adminLogin, getAllUsers, deleteUser, createUser, updateUser };