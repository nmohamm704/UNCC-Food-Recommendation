const express = require('express');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/restaurantRoutes');
const connectDB = require('./config/database');


const app = express();

// Middleware
app.use(express.json()); // JSON Parsing

// Database Connection
connectDB();

// mongoose.connect('mongodb://127.0.0.1:27017/foodRecommender')
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error(err));

// Routes
app.use('/api/restaurants', restaurantRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
