const mongoose = require('mongoose');

// Local mongodb instance
const mongoURI = 'mongodb://127.0.0.1:27017/foodRecommender';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
};

module.exports = connectDB;