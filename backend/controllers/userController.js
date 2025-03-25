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
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET || "1921u0030",
            { expiresIn: "30m" }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage, // Add the profile image to the response
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
            profileImage: user.profileImage, // Add the profile image to the response
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

const updateUserProfile = asyncHandler(async (req, res) => {
    const { userId, name, profileImage } = req.body;
    
    // Verify that the user is updating their own profile
    if (req.user.id !== userId) {
        return res.status(403).json({
            message: 'Not authorized to update this profile'
        });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    
    // Update user fields
    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;
    
    const updatedUser = await user.save();
    
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        message: 'Profile updated successfully'
    });
});

module.exports = { signupUser, loginUser, logoutUser, updateUserProfile };