const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/userAuth');

// User Registration
router.post('/register', userController.register);

// User Login
router.post('/login', userController.login);

// Protected Route Example (for getting user profile)
router.get('/profile', authenticate, async (req, res) => {
    try {
        res.json({ message: `Welcome, User ${req.user.userId}` });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error });
    }
});

// Get All Favorites
router.get('/favorites', authenticate, userController.getFavoriteRestaurants);

// Un/Favorite a Restaurant
router.post('/favorites/:restaurantId', authenticate, userController.toggleFavorite);



module.exports = router;


module.exports = router;
