# FoodMatch

A simple web app that helps students find dining options around campus based on their dietary preferences. Users can register, log in, set filters, favorite restaurants, and view detailed info on a map.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Getting Started](#getting-started)  
   - [1. Clone the Repo](#1-clone-the-repo)  
   - [2. Install Dependencies](#2-install-dependencies)  
   - [3. Configure Environment](#3-configure-environment)  
   - [4. Seed the Database](#4-seed-the-database)  
   - [5. Run the Server](#5-run-the-server)  
   - [6. Open the Client](#6-open-the-client)  
5. [API Endpoints](#api-endpoints)   
6. [Usage](#usage)  
7. [Future Improvements](#future-improvements)  
8. [Contributing](#contributing)  
9. [License](#license)  

---

## Features

- **Secure Authentication**  
  Register and log in with email/password. Passwords are hashed and sessions use JWT.  
- **Dietary Filters**  
  Filter restaurants by categories like Vegan, Halal, Gluten‑Free, etc.  
- **Interactive Map**  
  Leaflet‑powered map showing restaurant locations. Click a sidebar item to pan & fly to it.  
- **Favorites**  
  Mark restaurants as favorite and quickly view them on a dedicated page.  
- **Profile Management**  
  Upload profile picture, update name/email/password.  
- **Responsive Layout**  
  Designed to work on desktop browsers (mobile support can be added).

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript, [Leaflet.js](https://leafletjs.com/)  
- **Backend:** Node.js, Express  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JSON Web Tokens (JWT)  
- **File Uploads:** Multer  

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14+  
- [MongoDB](https://www.mongodb.com/) running locally or via a cloud provider  

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your‑username/foodmatch.git
cd foodmatch
```

### 2 Install Dependencies

```bash
# From the project root, install all server‑side packages
npm install
```

### 3 Configure Environment

Create a file named `.env` in the root of the project:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/foodRecommender
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

### 4 Seed the Database

Populate the restaurants collection with sample data. This script will connect to your MongoDB, clear out any existing entries, and insert the predefined restaurant records:

```bash
node server/seeds/seedRestaurants.js
```

### 5. Run the Server

```bash
npm run dev
# or
node server.js
```

### 6. Open the Client

Open the `client/register.html` file in your browser to start on the registration page:

- `register.html` — sign up for a new account  
- Once registered, you’ll be redirected to:
  - `login.html` — sign in with your credentials  
  - `home.html` — main map & sidebar  
- From the header you can navigate to:
  - `favorites.html` — view your favorited restaurants  
  - `profile.html` — view & edit your profile  

> **Tip:** If your browser blocks the `fetch()` calls due to CORS, serve the `client/` folder via a simple HTTP server (e.g., VSCode Live Server or `npx http-server`) instead of opening the files directly.


## API Endpoints

### Users

| Method | Endpoint                              | Description                                                 |
| ------ | ------------------------------------- | ----------------------------------------------------------- |
| POST   | `/api/users/register`                 | Register a new user (multipart/form-data: name, email, password, profileImage) |
| POST   | `/api/users/login`                    | Log in and receive a JWT                                    |
| PUT    | `/api/users/profile`                  | Update name, email, password, and/or profile picture (protected) |
| GET    | `/api/users/favorites`                | Get all favorite restaurants for the authenticated user     |
| POST   | `/api/users/favorites/:restaurantId`  | Toggle favorite/unfavorite a restaurant (protected)         |

### Restaurants

| Method | Endpoint                                    | Description                                                           |
| ------ | ------------------------------------------- | --------------------------------------------------------------------- |
| GET    | `/api/restaurants`                          | Get all restaurants; optionally filter by categories with `?categories=Vegan,Halal,…` |
| GET    | `/api/restaurants/search?query=<term>`      | Search restaurants by name or cuisine matching the given query        |
| GET    | `/api/restaurants/:id`                      | Get detailed information for a single restaurant by its ID            |

## Usage

1. **Register**  
   - Open `register.html` in your browser.  
   - Fill in your **Name**, **Email**, **Password**, and upload a **Profile Picture**.  
   - Click **Register** to create your account.  

2. **Log In**  
   - After successful registration you’ll be redirected to `login.html`.  
   - Enter your email and password, then click **Sign In**.  

3. **Browse Home**  
   - On `home.html`, use the **Filters** icon to choose dietary preferences.  
   - Click a restaurant in the sidebar to fly the map to its location and view a small popup.  
   - A detailed floating box appears next to the sidebar showing full restaurant info. Click the **X** or click outside to close it.  

4. **Favorites**  
   - Click the ❤️ on any restaurant card to favorite it.  
   - Navigate to `favorites.html` via the favorites icon in the header to see all your saved restaurants.  
   - In the favorites page, click a card to fly the map there or click the ❤️ again to unfavorite.  

5. **Profile & Settings**  
   - Click the **Settings** icon in the header, then **Account & Settings** to open `profile.html`.  
   - View or update your **Name**, **Email**, **Password**, and **Profile Picture**.  
   - Changes are saved via the **Save Changes** button.  

6. **Navigation**  
   - Use the **FoodMatch** logo in the header to return to the home page at any time.  
   - Use the header dropdown to jump between **Home**, **Favorites**, and **Profile**.
