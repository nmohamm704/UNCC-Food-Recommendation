const request  = require('supertest');
const fs       = require('fs');
const path     = require('path');
const mongoose = require('mongoose');
const app      = require('../server');
const User     = require('../models/userModel');

describe('User Registration, Auth & Protected API Routes', () => {
    const testPassword = 'test1234';
    let testEmail;
    let jwtToken;
    let restaurants;

    beforeAll(() => {
        // generate a 1×1 PNG fixture for uploads
        const fixturesDir = path.join(__dirname, 'fixtures');
        if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir);
        const pngBase64 =
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA' +
            'AAC0lEQVR42mP8/5+hHgAHggJ/PQ7R5QAAAABJRU5ErkJggg==';
        fs.writeFileSync(
            path.join(fixturesDir, 'profile.png'),
            Buffer.from(pngBase64, 'base64')
        );
    });

    it('1) Registers a user (POST /api/users/register → 201)', async () => {
        testEmail = `test${Date.now()}@example.com`;
        const res = await request(app)
            .post('/api/users/register')
            .field('name',     'Test User')
            .field('email',    testEmail)
            .field('password', testPassword)
            .attach(
                'profileImage',
                path.join(__dirname, 'fixtures', 'profile.png')
            );

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(testEmail);
    });

    it('2) Logs in and receives a JWT (POST /api/users/login → 200)', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: testEmail, password: testPassword });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        jwtToken = res.body.token;
    });

    it('3) GET /api/restaurants returns a list', async () => {
        const res = await request(app)
            .get('/api/restaurants')           // no auth required
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        restaurants = res.body;
    });

    it('4) POST /api/users/favorites/:id toggles a favorite', async () => {
        const firstId = restaurants[0]._id;
        const res = await request(app)
            .post(`/api/users/favorites/${firstId}`)
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(res.statusCode).toBe(200);
        // controller sends back a message, e.g. "Favorited" or "Unfavorited"
        expect(res.body).toHaveProperty('message');
    });

    it('5) GET /api/users/favorites returns your favorites', async () => {
        const res = await request(app)
            .get('/api/users/favorites')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // Ensure the restaurant we just favorited is in the list
        const ids = res.body.map(r => r._id);
        expect(ids).toContain(restaurants[0]._id);
    });

    it('6) GET /api/users/profile returns your profile', async () => {
        const res = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email', testEmail);
        expect(res.body).toHaveProperty('name', 'Test User');
    });

    it('7) PUT /api/users/profile updates name & email', async () => {
        const newName  = 'Updated Name';
        const newEmail = `updated+${Date.now()}@example.com`;

        const res = await request(app)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({ name: newName, email: newEmail });

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('name', newName);
        expect(res.body.user).toHaveProperty('email', newEmail);

        // And a follow-up GET returns the updated data
        const res2 = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${jwtToken}`);

        expect(res2.body).toHaveProperty('name', newName);
        expect(res2.body).toHaveProperty('email', newEmail);
    });

    afterAll(async () => {
        // Clean up: remove this test user and close the DB connection
        await User.deleteMany({ email: { $regex: /^test|^updated\+/ } });
        await mongoose.disconnect();
    });
});