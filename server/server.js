const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/database');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');


const app = express();


// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from /uploads
app.use(morgan('dev'));
app.use(express.json()); // JSON Parsing

// Database Connection
connectDB();

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);

// Error Handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use(errorHandler);

module.exports = app;

