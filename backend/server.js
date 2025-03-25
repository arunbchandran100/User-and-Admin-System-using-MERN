const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Adjust the path as necessary
const mongoose = require('mongoose');

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));