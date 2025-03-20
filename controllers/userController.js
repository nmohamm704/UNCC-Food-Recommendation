const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '1234';

// Register User
exports.register = async (req, res) => {
    try {
        const { email, password, image } = req.body;
        const user = new User({ email, password, image });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

// Adding and removing restaurants to/from favorites
exports.toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.userId; // Extracted from JWT
        const { restaurantId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.favorites.indexOf(restaurantId);
        if (index === -1) {
            // If restaurant is not in favorites, add it
            user.favorites.push(restaurantId);
            await user.save();
            return res.json({ message: "Restaurant favorited", favorited: true });
        } else {
            // If restaurant is already in favorites, remove it
            user.favorites.splice(index, 1);
            await user.save();
            return res.json({ message: "Restaurant unfavorited", favorited: false });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get all favorite restaurants for the authenticated user
exports.getFavoriteRestaurants = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorite restaurants', error: error.message });
    }
};

