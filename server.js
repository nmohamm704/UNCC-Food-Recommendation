const express = require('express');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/database');
const morgan = require('morgan');


const app = express();


// Middleware
app.use(morgan('dev'));
app.use(express.json()); // JSON Parsing

// Database Connection
connectDB();

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
