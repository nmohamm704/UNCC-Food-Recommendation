const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/userAuth');
const upload = require("../middleware/fileUpload");

//Import Validators
const {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
    validateObjectId,
    runValidation
} = require('../middleware/validators');

// User Registration
router.post('/register', upload.single('profileImage'), validateRegister, runValidation, userController.register);

// User Login
router.post('/login', validateLogin, runValidation, userController.login);

// Update Profile Route (Now Accepts Partial Updates)
router.put("/profile", authenticate, upload.single('profileImage'), validateProfileUpdate, runValidation, userController.update);

// View User Profile
router.get('/profile', authenticate, userController.getProfile);

// Get All Favorites
router.get('/favorites', authenticate, userController.getFavoriteRestaurants);

// Un/Favorite a Restaurant
router.post('/favorites/:restaurantId', authenticate, validateObjectId, runValidation, userController.toggleFavorite);


module.exports = router;
