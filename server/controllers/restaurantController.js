const Restaurant = require('../models/restaurantModel');

// Get all restaurants
exports.getRestaurants = async (req, res) => {
    try {
        let query = {};

        // Check if a filter is provided
        if (req.query.categories) {
            const categoriesArray = req.query.categories.split(',');
            query.categories = { $all: categoriesArray };
        }

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get restaurant by search (name)
exports.searchRestaurants = async (req, res) => {
    try {
        const  query  = req.query.q;

        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }

        // Create a case-insensitive regex
        const searchRegex = new RegExp(query, "i");

        // Find restaurants matching the name or cuisine
        const restaurants = await Restaurant.find({
            $or: [{ name: searchRegex }, { cuisine: searchRegex }]
        });

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

