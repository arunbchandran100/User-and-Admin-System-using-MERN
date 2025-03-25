const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/week-20-users')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Add this near the top of your file, before any routes are defined
const dotenv = require('dotenv');
dotenv.config();

console.log('Environment check:');
console.log('ADMIN_EMAIL set:', !!process.env.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD set:', !!process.env.ADMIN_PASSWORD);
console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));