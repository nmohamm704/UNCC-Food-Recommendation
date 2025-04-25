const User = require('../models/userModel');
const Restaurant   = require('../models/restaurantModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET;

// --------------------------- Register ---------------------------
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const profileImage = req.file
        ? `/uploads/${req.file.filename}`
        : null;

    const newUser = new User({
        name,
        email: email.toLowerCase(),
        password,
        profileImage
    });

    await newUser.save();

    res
        .status(201)
        .json({ message: 'User registered successfully!', user: newUser });
});

// ---------------------------- Login -----------------------------
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        throw err;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
});

// ----------------------- Update Profile ------------------------
exports.update = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    const { name, email, password } = req.body;
    if (name)  user.name  = name;
    if (email) user.email = email.toLowerCase();
    if (password) user.password = password;
    if (req.file) {
        user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
});

// --------------- Toggle Favorite / Unfavorite ------------------
exports.toggleFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    const { restaurantId } = req.params;
    const idx = user.favorites.indexOf(restaurantId);

    let favorited;
    if (idx === -1) {
        user.favorites.push(restaurantId);
        favorited = true;
    } else {
        user.favorites.splice(idx, 1);
        favorited = false;
    }
    await user.save();

    res.json({
        message: favorited ? 'Restaurant favorited' : 'Restaurant unfavorited',
        favorited
    });
});

// ---------------- Get All Favorite Restaurants -----------------
exports.getFavoriteRestaurants = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    const favIds = user.favorites;
    const { search, categories } = req.query;

    // Reject if both present
    if (search && categories) {
        const err = new Error('Please provide either search or categories, not both');
        err.status = 400;
        throw err;
    }

    // Build the query object
    let filter = { _id: { $in: favIds } };

    if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [{ name: regex }, { cuisine: regex }];
    } else if (categories) {
        const arr = categories
            .split(',')
            .map(cat => cat.trim().toLowerCase());
        filter.categories = { $all: arr };
    }

    // Run the query
    const results = await Restaurant.find(filter);
    res.json(results);
});


// ------------------------- Get Profile -------------------------
exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    res.json({
        name:        user.name,
        email:       user.email,
        profileImage: user.profileImage
    });
});
