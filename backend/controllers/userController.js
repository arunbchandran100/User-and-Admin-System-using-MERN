const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken'); // Add JWT

const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword, imageUrl } = req.body;

    if (password !== confirmPassword) {
        res.status(400);
        throw new Error('Passwords do not match');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        image: imageUrl
    });

    if (user) {
        // Generate JWT token
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
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        // Generate JWT token
        const token = Jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET || "1921u0030",
            { expiresIn: "30m" } // Set expiration to 30 minutes
        );

        res.status(200).json({
            message: "Login successful",
            token
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = { signupUser, loginUser };