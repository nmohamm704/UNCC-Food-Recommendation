const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Middleware to run validation results
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Function to handle image uploads validation
const checkProfileImage = (value, { req }) => {
    if (!req.file) {
        throw new Error('Image file is required.');
    }
    next();
};

// ------------------ User Validators ------------------ //

// POST /users/register
const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required.').escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6, max: 64 }).withMessage('Password must be 6 to 64 characters long.'),
    body('profileImage').custom(checkProfileImage)
];

// POST /users/login
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
];

// PUT /users/profile (optional fields)
const validateProfileUpdate = [
    body('name').optional().notEmpty().trim().escape(),
    body('email').optional().notEmpty().trim().isEmail().withMessage('Invalid email format.').normalizeEmail(),
    body('password').optional().isLength({ min: 6, max: 64 }).withMessage('Password must be 6 to 64 characters long.')
];

// POST /users/favorites/:restaurantId
const validateObjectId = [
    param('restaurantId').custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid restaurant ID.');
        }
        return true;
    })
];

// ------------------ Restaurant Validators ------------------ //

// GET /restaurants/search (optional query: name)
const validateSearchQuery = [
    query('search').optional().trim().escape()
];

// GET /restaurants/:id (restaurant by ID)
const validateRestaurantIdParam = [
    param('id').custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid restaurant ID.');
        }
        return true;
    })
];

// Export all validators
module.exports = {
    validateRegister,
    validateLogin,
    validateProfileUpdate,
    validateObjectId,
    validateSearchQuery,
    validateRestaurantIdParam,
    runValidation
};