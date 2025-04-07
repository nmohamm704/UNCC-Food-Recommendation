const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/userAuth');
const upload = require("../middleware/fileUpload");

// User Registration
router.post('/register', upload.single('profileImage'),  userController.register);

// User Login
router.post('/login', userController.login);

// Update Profile Route (Now Accepts Partial Updates)
router.put("/profile", authenticate, upload.single('profileImage'), userController.update);

// Protected Route Example (for getting user profile)
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await require('../models/userModel').findById(req.user.userId);
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
});

// Get All Favorites
router.get('/favorites', authenticate, userController.getFavoriteRestaurants);

// Un/Favorite a Restaurant
router.post('/favorites/:restaurantId', authenticate, userController.toggleFavorite);


module.exports = router;
