require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('../models/restaurantModel');

const mongoURI = process.env.MONGO_URI;

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
            },
            {
                name: "Cava",
                address: "8936 J M Keynes Dr, Charlotte, NC 28262",
                coordinates: { lat: 35.310047046044815, lng: -80.74785836129277 },
                description: "Fast-casual restaurant specializing in fresh and natural Mediterranean food options.",
                categories: ["Vegetarian", "Nut-Free", "Vegan", "Dairy-Free", "Gluten-Free"],
                cuisine: "Mediterranean",
                operatingHours: {
                    monday: "10:45 AM - 10:00 PM",
                    tuesday: "10:45 AM - 10:00 PM",
                    wednesday: "10:45 AM - 10:00 PM",
                    thursday: "10:45 AM - 10:00 PM",
                    friday: "10:45 AM - 10:00 PM",
                    saturday: "10:45 AM - 10:00 PM",
                    sunday: "10:45 AM - 10:00 PM"
                },
                website: "https://cava.com/",
                phone: "704-243-5900"
            },
            {
                name: "Banhmi Brothers",
                address: "230 E W.T. Harris Blvd suite a7, Charlotte, NC 28262",
                coordinates: { lat: 35.303721062338894, lng: -80.74888998798407 },
                description: "Family-owned eatery offering spring rolls & banh mi sandwiches with vegan options in a casual space.",
                categories: ["Vegetarian", "Nut-Free", "Vegan", "Dairy-Free"],
                cuisine: "Vietnamese",
                operatingHours: {
                    monday: "10:30 AM - 7:00 PM",
                    tuesday: "10:30 AM - 7:00 PM",
                    wednesday: "10:30 AM - 7:00 PM",
                    thursday: "10:30 AM - 7:00 PM",
                    friday: "10:30 AM - 8:00 PM",
                    saturday: "10:30 AM - 8:00 PM",
                    sunday: "11:00 AM - 7:00 PM"
                },
                website: "https://banhmibrothers.com/",
                phone: "704-900-7842"
            },
            {
                name: "Mikes Vegan Grill",
                address: "440 E McCullough Dr #123, Charlotte, NC 28262",
                coordinates: { lat: 35.34692818561043, lng: -80.74776002766338 },
                description: "Vegan restaurant offering plant-based entrees and sides.",
                categories: ["Vegetarian", "Nut-Free", "Vegan", "Gluten-Free", "Dairy-Free"],
                cuisine: "Vegan Comfort Food",
                operatingHours: {
                    monday: "11:00 AM - 9:00 PM",
                    tuesday: "11:00 AM - 9:00 PM",
                    wednesday: "11:00 AM - 9:00 PM",
                    thursday: "11:00 AM - 9:00 PM",
                    friday: "11:00 AM - 12:00 AM",
                    saturday: "11:00 AM - 12:00 AM",
                    sunday: "11:00 AM - 9:00 PM"
                },
                website: "https://business.google.com/v/mikes-vegan-grill/09142340509386790890/4c32/_?caid=21058360441&agid=168806598467&gclid=Cj0KCQjwna6_BhCbARIsALId2Z3bf1q6i7MXJfB9a06bRLo3xmhJz058MWi9xybII1Tx6gRkCEi01TEaAnDjEALw_wcB&gbraid=0AAAAA9XnuEtpbal0OXiNs5at0PkB5jvqa",
                phone: "704-909-0807"
            },
            {
                name: "Sarangi, Indian and Nepali Cuisine",
                address: "9211 N Tryon St #13, Charlotte, NC 28262",
                coordinates: { lat: 35.312876301279, lng: -80.74477065066175 },
                description: "Indian restaurant offering a wide variety of vegan and vegetarian options.",
                categories: ["Vegetarian", "Vegan", "Dairy-Free", "Gluten-Free"],
                cuisine: "Indian",
                operatingHours: {
                    monday: "11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM",
                    tuesday: "Closed",
                    wednesday: "11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM",
                    thursday: "11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM",
                    friday: "11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM",
                    saturday: "11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM",
                    sunday: "11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM"
                },
                website: "https://www.indian-food.restaurant/",
                phone: "704-526-0716"
            },
            {
                name: "Noodles and Company",
                address: "8926 J M Keynes Dr, Charlotte, NC 28262",
                coordinates: { lat: 35.30916851137137, lng: -80.74681075120762 },
                description: "Chain restaurant that serves a variety of noodle and pasta dishes.",
                categories: ["Vegetarian", "Vegan", "Dairy-Free", "Gluten-Free"],
                cuisine: "Comfort Food",
                operatingHours: {
                    monday: "10:30 AM - 9:00 PM",
                    tuesday: "10:30 AM - 9:00 PM",
                    wednesday: "10:30 AM - 9:00 PM",
                    thursday: "10:30 AM - 9:00 PM",
                    friday: "10:30 AM - 10:00 PM",
                    saturday: "10:30 AM - 10:00 PM",
                    sunday: "10:30 AM - 9:00 PM"
                },
                website: "https://locations.noodles.com/nc/charlotte/8926-jm-keynes-dr?utm_campaign=soci&utm_medium=organic&utm_source=google",
                phone: "704-549-0188"
            },
            {
                name: "Nazo’s Wrap Way",
                address: "10221 University City Blvd, Charlotte, NC 28213",
                coordinates: { lat: 35.31252978813073, lng: -80.71316834678072 },
                description: "Chain restaurant that serves a variety of dishes with wraps and bowls.",
                categories: ["Vegetarian", "Vegan", "Dairy-Free"],
                cuisine: "Comfort Food",
                operatingHours: {
                    monday: "10:30 AM - 9:00 PM",
                    tuesday: "10:30 AM - 9:00 PM",
                    wednesday: "10:30 AM - 9:00 PM",
                    thursday: "10:30 AM - 9:00 PM",
                    friday: "10:30 AM - 10:00 PM",
                    saturday: "10:30 AM - 10:00 PM",
                    sunday: "10:30 AM - 9:00 PM"
                },
                website: "https://locations.noodles.com/nc/charlotte/8926-jm-keynes-dr?utm_campaign=soci&utm_medium=organic&utm_source=google",
                phone: "704-549-0188"
            },
            {
                name: "Schreiber’s on Rye",
                address: "1115 N Brevard St #14, Charlotte, NC 28206",
                coordinates: { lat: 35.239127450128464, lng: -80.82663193493919 },
                description: "Jewish deli counter specializing in New York–style sandwiches, matzo ball soup, and knishes.",
                categories: ["Kosher", "Vegan", "Vegetarian"],
                cuisine: "Casual",
                operatingHours: {
                    monday: "11:00 AM - 9:00 PM",
                    tuesday: "11:00 AM - 9:00 PM",
                    wednesday: "11:00 AM - 9:00 PM",
                    thursday: "11:00 AM - 9:00 PM",
                    friday: "11:00 AM - 10:00 PM",
                    saturday: "11:00 AM - 10:00 PM",
                    sunday: "11:00 AM - 9:00 PM"
                },
                website: "https://schreibersonrye.com/",
                phone: "704-625-2269"
            },
            {
                name: "Kosher Charlotte",
                address: "6619 Sardis Rd, Charlotte, NC 28270",
                coordinates: { lat: 35.15552247008143, lng: -80.77067032630171 },
                description: "Kosher meal delivery option dishing up salmon, teriyaki chicken, and more.",
                categories: ["Kosher", "Vegan", "Vegetarian"],
                cuisine: "Casual",
                operatingHours: {
                    monday: "11:00 AM - 6:00 PM",
                    tuesday: "11:00 AM - 6:00 PM",
                    wednesday: "11:00 AM - 6:00 PM",
                    thursday: "11:00 AM - 6:00 PM",
                    friday: "11:00 AM - 6:00 PM",
                    saturday: "11:00 AM - 6:00 PM",
                    sunday: "11:00 AM - 6:00 PM"
                },
                website: "http://www.koshercharlotte.com/",
                phone: "704-256-0134"
            },
            {
                name: "Kabab 2 Go Uptown",
                address: "101 N Tryon St, Charlotte, NC 28202",
                coordinates: { lat: 35.227896462101825, lng: -80.84281674122764 },
                description: "Family-run operation serving Lebanese Mediterranean fare, including chicken kebabs and hummus, in casual digs.",
                categories: ["Kosher", "Vegan", "Vegetarian"],
                cuisine: "Casual",
                operatingHours: {
                    monday: "11:00 AM - 9:00 PM",
                    tuesday: "11:00 AM - 9:00 PM",
                    wednesday: "11:00 AM - 9:00 PM",
                    thursday: "11:00 AM - 9:00 PM",
                    friday: "11:00 AM - 10:00 PM",
                    saturday: "11:00 AM - 10:00 PM",
                    sunday: "11:00 AM - 9:00 PM"
                },
                website: "https://kabab2go.com/",
                phone: "704-321-1313"
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
