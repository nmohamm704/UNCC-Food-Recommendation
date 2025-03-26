const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Route to search for restaurants
router.get("/search", restaurantController.searchRestaurants);

// Route to get all restaurants
router.get('/', restaurantController.getRestaurants);

// Route to get a single restaurant by ID
router.get('/:id', restaurantController.getRestaurantById);


module.exports = router;

