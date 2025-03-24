const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

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
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

module.exports = { signupUser };