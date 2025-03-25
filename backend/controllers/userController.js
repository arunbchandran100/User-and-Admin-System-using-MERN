const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken'); // Add JWT

const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword)

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: 'Passwords do not match'
        });
    }

    const userExists = await User.findOne({ email });
    console.log(userExists) // Add this line to log the userExists value t
    if (userExists) {
        return res.status(400).json({
            message: 'Email already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        const token = Jwt.sign(
            { id: user._id, name, email },
            process.env.JWT_SECRET || "1921u0030",
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User registered successfully",
            token
        });
    } else {
        return res.status(400).json({
            message: 'Invalid user data'
        });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return res.status(401).json({
            message: 'User not found'
        }); 
    }

    if (user && await bcrypt.compare(password, user.password)) {
        const token = Jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET || "1921u0030",
            { expiresIn: "30m" }
        );
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    } else {
        return res.status(401).json({
            message: 'Invalid password'
        });
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        // You might want to handle token blacklisting here if implemented
        res.status(200).json({
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error during logout'
        });
    }
});

module.exports = { signupUser, loginUser, logoutUser };