const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    description: { type: String, required: true },
    categories: [{ type: String, required: true, lowercase: true,
                enum: ['halal', 'kosher', 'vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'pescetarian'] }],
    cuisine: { type: String, required: true },
    operatingHours: {
        monday: { type: String, required: true },
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday: { type: String, required: true },
        friday: { type: String, required: true },
        saturday: { type: String, required: true },
        sunday: { type: String, required: true }
    },
    website: { type: String, required: true },
    phone: { type: String, required: true },
    menu: { type: String, required: true }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
