const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        // Create new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password,
            profileImage
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error signing up", error });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

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

// Update User
exports.update = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract from token
        const { name, email, password } = req.body;
        const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only the provided fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (profileImage) user.profileImage = profileImage;

        await user.save();

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
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

//Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            name: user.name,
            email: user.email,
            profileImage: user.profileImage
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
};

