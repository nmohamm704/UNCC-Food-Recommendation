const express = require('express');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/database');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');


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

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
