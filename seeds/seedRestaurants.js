const mongoose = require('mongoose');
const Restaurant = require('../models/restaurantModel');

const mongoURI = 'mongodb://127.0.0.1:27017/foodRecommender';

const seedRestaurants = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const restaurants = [
            {
                name: 'Chipotle',
                address: '9335 N Tryon St #101, Charlotte, NC 28262',
                coordinates: { lat: 35.31570175805021 , lng: -80.73991387009701 },
                description: 'Fast-food chain offering Mexican fare, including design-your-own burritos, tacos & bowls.',
                categories: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'],
                cuisine: 'Mexican',
                operatingHours: {
                    monday: '10:45 AM - 11:00 PM',
                    tuesday: '10:45 AM - 11:00 PM',
                    wednesday: '10:45 AM - 11:00 PM',
                    thursday: '10:45 AM - 11:00 PM',
                    friday: '10:45 AM - 11:00 PM',
                    saturday: '10:45 AM - 11:00 PM',
                    sunday: '10:45 AM - 11:00 PM'
                },
                website: 'https://locations.chipotle.com/nc/charlotte/9335-n-tryon-st',
                phone: '980-202-7032'
            },
            {
                name: 'Chick-fil-A',
                address: 'ID Office, Cone University Center, 9201 University City Blvd, Charlotte, NC 28223',
                coordinates: { lat: 35.30737850309987, lng: -80.72818636621342 },
                description: 'Fast-food chain serving chicken sandwiches & nuggets along with salads & sides.',
                categories: ['Gluten-Free', 'Dairy-Free'],
                cuisine: 'Fast Food',
                operatingHours: {
                    monday: '8:30 AM - 7:00 PM',
                    tuesday: '8:30 AM - 7:00 PM',
                    wednesday: '8:30 AM - 7:00 PM',
                    thursday: '8:30 AM - 7:00 PM',
                    friday: '8:30 AM - 4:00 PM',
                    saturday: 'Closed',
                    sunday: 'Closed'
                },
                website: 'https://www.chick-fil-a.com/locations/nc/university-of-nc-charlotte',
                phone: '704-687-3391'
            },
            {
                name: 'MI Barrio Halal Food Cart',
                address: '9340 University City Blvd, Charlotte, NC 28213',
                coordinates: { lat: 35.330559 , lng: -80.72418 },
                description: 'Food Truck offering Halal food options at an affordable price.',
                categories: ['Vegetarian', 'Halal', 'Nut-Free'],
                cuisine: 'Mediterranean',
                operatingHours: {
                    monday: '11:00 AM - 12:00 AM',
                    tuesday: '11:00 AM - 12:00 AM',
                    wednesday: '11:00 AM - 12:00 AM',
                    thursday: '11:00 AM - 1:00 AM',
                    friday: '11:00 AM - 1:00 AM',
                    saturday: '11:00 AM - 1:00 AM',
                    sunday: '11:00 AM - 12:00 AM'
                },
                website: 'https://www.grubhub.com/restaurant/halal-cart-university-9430--university-city-blvd-charlotte/4377416',
                phone: '516-205-0020'
            },
            {
                name: "Dave's Hot Chicken",
                address: '8932 J M Keynes Dr #100, Charlotte, NC 28262',
                coordinates: { lat: 35.365589876467695, lng: -80.76494687471101},
                description: 'Fast Food chain that serves Nashville Style hot chicken.',
                categories: ['Vegetarian', 'Halal', 'Nut-Free'],
                cuisine: 'Fast Food',
                operatingHours: {
                    monday: '11:00 AM - 11:00 PM',
                    tuesday: '11:00 AM - 11:00 PM',
                    wednesday: '11:00 AM - 11:00 PM',
                    thursday: '11:00 AM - 11:00 PM',
                    friday: '11:00 AM - 12:00 AM',
                    saturday: '11:00 AM - 12:00 AM',
                    sunday: '11:00 AM - 10:00 PM'
                },
                website: 'https://restaurants.daveshotchicken.com/nc/charlotte/spicy-chicken-sandwich-on-keynes-drive/?utm_source=google&utm_medium=wiideman&utm_campaign=pageleap',
                phone: '980-392-2120'
            },
            {
                name: 'Mezeh',
                address: '8926 J M Keynes Dr ste b, Charlotte, NC 28262',
                coordinates: { lat: 35.312446247818635, lng: -80.74738741267593},
                description: 'Fast-Casual restaurant specializing in fresh and natural mediterranean/halal food options.',
                categories: ['Vegetarian', 'Halal', 'Vegan'],
                cuisine: 'Mediterranean',
                operatingHours: {
                    monday: '10:30 AM - 11:00 PM',
                    tuesday: '10:30 AM - 11:00 PM',
                    wednesday: '10:30 AM - 11:00 PM',
                    thursday: '10:30 AM - 11:00 PM',
                    friday: '10:30 AM - 11:00 PM',
                    saturday: '10:30 AM - 11:00 PM',
                    sunday: '10:30 AM - 11:00 PM'
                },
                website: 'https://mezeh.com/',
                phone: '980-415-2782'
            },
            {
                name: 'Chex Grill & Wings',
                address: '440 E McCullough Dr #120, Charlotte, NC 28262',
                coordinates: { lat: 35.307907739651256, lng: -80.75116414855624},
                description: 'Fast-Casual restaurant chain that provides a variety of fresh mediterranean and chicken food options.',
                categories: ['Vegetarian', 'Halal', 'Vegan'],
                cuisine: 'Fast Food',
                operatingHours: {
                    monday: '10:00 AM - 11:45 PM',
                    tuesday: '10:00 AM - 11:45 PM',
                    wednesday: '10:00 AM - 11:45 PM',
                    thursday: '10:00 AM - 11:45 PM',
                    friday: '10:00 AM - 1:45 AM',
                    saturday: '10:00 AM - 1:45 PM',
                    sunday: '10:00 AM - 9:30 PM'
                },
                website: 'http://chexgrill.com/',
                phone: '980-219-7232'
    }


    ];

        await Restaurant.deleteMany({});
        console.log('Existing restaurants removed');

        await Restaurant.insertMany(restaurants);
        console.log('Database seeded successfully');

        mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

// Run the seeding function
seedRestaurants();
