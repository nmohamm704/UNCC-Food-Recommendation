const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Import validators for searching & ID params
const {
    validateSearchQuery,
    validateRestaurantIdParam,
    runValidation
} = require('../middleware/validators');

// Route to search for restaurants
router.get("/search", validateSearchQuery, runValidation, restaurantController.searchRestaurants);

// Route to get all restaurants
router.get('/', restaurantController.getRestaurants);

// Route to get a single restaurant by ID
router.get('/:id',  validateRestaurantIdParam, runValidation, restaurantController.getRestaurantById);


module.exports = router;

