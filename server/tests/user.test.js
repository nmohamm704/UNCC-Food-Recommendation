const request = require('supertest');
const path = require('path');
const app = require('../server');

describe('User Registration', () => {
    it('should register a user with profile image and return 201', async () => {
        const imagePath = path.join(__dirname, '../uploads/1743572729978-595271793.png');

        const res = await request(app)
            .post('/api/users/register')
            .field('name', 'Test User')
            .field('email', `test${Date.now()}@example.com`)
            .field('password', 'test1234')
            .attach('profileImage', imagePath);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toMatch(/test.*@example\.com/);
    });

    afterAll(async () => {
        const mongoose = require('mongoose');
        const User = require('../models/userModel');
        await User.deleteMany({ email: /test.*@example\.com/ });
        await mongoose.disconnect();
    });
});