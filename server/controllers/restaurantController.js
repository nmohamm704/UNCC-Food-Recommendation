const Restaurant   = require('../models/restaurantModel');
const asyncHandler = require('../utils/asyncHandler');

/* ------------------------- Get all restaurants ------------------------- */
exports.getRestaurants = asyncHandler(async (req, res) => {
    const query = {};

    if (req.query.categories) {
        const categoriesArray = req.query.categories
            .split(',')
            .map(cat => cat.trim().toLowerCase());
        query.categories = { $all: categoriesArray };
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
});

/* ---------------------- Get single restaurant by ID -------------------- */
exports.getRestaurantById = asyncHandler(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
        const err = new Error('Restaurant not found');
        err.status = 404;
        throw err;                     // handled by global error‑handler
    }

    res.json(restaurant);
});

/* ----------------------- Search restaurants (name / cuisine) ----------- */
exports.searchRestaurants = asyncHandler(async (req, res) => {
    const { search } = req.query;    // we agreed query param is ?search=

    if (!search) {
        const err = new Error('Search query is required.');
        err.status = 400;
        throw err;
    }

    const regex = new RegExp(search, 'i');

    const restaurants = await Restaurant.find({
        $or: [{ name: regex }, { cuisine: regex }]
    });

    res.json(restaurants);
});
