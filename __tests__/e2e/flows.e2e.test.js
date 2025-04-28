/**
 * __tests__/e2e/flows.e2e.test.js
 */
// __tests__/e2e/register.e2e.test.js

jest.setTimeout(60_000);

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CLIENT = process.env.CLIENT_URL || 'http://localhost:5000';
const API    = process.env.BASE_URL   || 'http://localhost:3000';

describe('FoodMatch Full E2E Flow (with precise selectors)', () => {
    let browser, page;
    const unique = Date.now();
    const email    = `e2e+${unique}@example.com`;
    const password = 'RealPass123!';

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        page    = await browser.newPage();
        page.on('dialog', d => d.accept());
    });

    afterAll(async () => {
        await browser.close();
    });

    test('1) Register → login page', async () => {
        await page.goto(`${CLIENT}/register.html`, { waitUntil: 'networkidle2' });
        await page.type('#name',     'E2E User');
        await page.type('#email',    email);
        await page.type('#password', password);
        await (await page.$('#profileImage'))
            .uploadFile(`${__dirname}/fixtures/profile.png`);
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        expect(page.url()).toMatch(/\/login(?:\.html)?$/);
    });

    test('2) Login → home page', async () => {
        await page.type('#email',    email);
        await page.type('#password', password);
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        expect(page.url()).toMatch(/\/home(?:\.html)?$/);
    });

    test('3) Favorite a restaurant on Home', async () => {
        // wait for the matches container and at least one card
        await page.waitForSelector('.matches .match', { timeout: 20_000 });

        // wait for the heart icon deep in the hierarchy
        const heartSel = '.matches .match .restaurant-info .restaurant-top img.fav-black';
        await page.waitForSelector(heartSel, { timeout: 10_000 });

        // click to favorite
        await page.click(heartSel);

        // wait for its src to flip to fav_full.png
        await page.waitForFunction(sel => {
            const img = document.querySelector(sel);
            return img && img.src.includes('fav_full.png');
        }, { timeout: 5000 }, heartSel);
    });

    test('4) Appears on Favorites page', async () => {
        await page.goto(`${CLIENT}/favorites.html`, { waitUntil: 'networkidle2' });

        // wait for at least one favorited match
        const nameSel = '.matches .match .restaurant-info .restaurant-name';
        await page.waitForSelector(nameSel, { timeout: 10_000 });
        const names = await page.$$eval(nameSel, els => els.map(e => e.textContent.trim()));
        expect(names.length).toBeGreaterThan(0);
    });

    test('5) Search within Favorites filters correctly', async () => {
        const nameSel = '.matches .match .restaurant-info .restaurant-name';
        const firstName = await page.$eval(
            nameSel,
            el => el.textContent.trim().split(' ')[0]
        );

        // type & click in your favorites search-bar
        await page.click('.search-bar input');
        await page.type('.search-bar input', firstName);
        await page.click('.search-bar button');

        // small pause
        await new Promise(r => setTimeout(r, 500));

        const filtered = await page.$$eval(
            nameSel,
            els => els.map(e => e.textContent.trim().toLowerCase())
        );
        expect(filtered.length).toBeGreaterThan(0);
        filtered.forEach(txt => expect(txt).toContain(firstName.toLowerCase()));
    });

    test('6) Map interaction still works', async () => {
        await page.goto(`${CLIENT}/home.html`, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.leaflet-marker-icon', { timeout: 15_000 });

        const markerCount = await page.$$eval(
            '.leaflet-marker-icon',
            els => els.length
        );
        expect(markerCount).toBeGreaterThan(0);

        await page.click('.leaflet-marker-icon');
        await page.waitForSelector('.leaflet-popup-content', { timeout: 10_000 });
        const popupText = await page.$eval(
            '.leaflet-popup-content',
            el => el.textContent.trim()
        );
        expect(popupText.length).toBeGreaterThan(0);
    });

    test('7) Update profile info successfully', async () => {
        // Go to the profile page
        await page.goto(`${CLIENT}/profile.html`, { waitUntil: 'networkidle2' });

        // Wait for the existing user name to appear
        await page.waitForSelector('#user-name', { timeout: 10_000 });
        const originalName = await page.$eval('#user-name', el => el.textContent.trim());

        // Prepare updated values
        const newName  = `Updated ${originalName}`;
        const newEmail = `updated+${unique}@example.com`;

        // Clear and fill in the Name field
        await page.click('#edit-name');
        await page.evaluate(() => { document.getElementById('edit-name').value = ''; });
        await page.type('#edit-name', newName);

        // Clear and fill in the Email field
        await page.click('#edit-email');
        await page.evaluate(() => { document.getElementById('edit-email').value = ''; });
        await page.type('#edit-email', newEmail);

        // Fill in the Password field (optional)
        await page.click('#edit-password');
        await page.type('#edit-password', 'NewPass123!');

        // Upload a new profile picture (reuse the fixture)
        await (await page.$('#edit-profile-image'))
            .uploadFile(`${__dirname}/fixtures/profile.png`);

        // Submit the form and wait for reload
        await Promise.all([
            page.click('#edit-profile-form button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30_000 }),
        ]);

        // After reload, ensure the displayed user name has updated
        await page.waitForSelector('#user-name', { timeout: 10_000 });
        const updatedName = await page.$eval('#user-name', el => el.textContent.trim());
        expect(updatedName).toBe(newName);
    })
});
