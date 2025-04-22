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
6. [Project Structure](#project-structure)  
7. [Usage](#usage)  
8. [Future Improvements](#future-improvements)  
9. [Contributing](#contributing)  
10. [License](#license)  

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
npm install
# If you keep client and server separate:
# cd client && npm install
# cd server && npm install
