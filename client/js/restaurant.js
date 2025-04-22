let userFavoriteIds = [];
let currentOpenRestaurantId = null;
const markers = {};

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");
    const map = window.mainMap;

    if (!token || !matchesContainer || !map) return;

    // Load user's favorite IDs
    try {
        const favResponse = await fetch("http://localhost:3000/api/users/favorites", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const favData = await favResponse.json();
        if (Array.isArray(favData)) {
            userFavoriteIds = favData.map(fav => fav._id);
        }
    } catch (favErr) {
        console.error("Failed to load user's favorites:", favErr);
    }

    // Load all restaurants
    try {
        const response = await fetch("http://localhost:3000/api/restaurants", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const restaurants = await response.json();

        if (!Array.isArray(restaurants)) {
            console.error("Unexpected response format:", restaurants);
            return;
        }

        if (restaurants.length === 0) {
            matchesContainer.innerHTML += "<p>No matches found.</p>";
            return;
        }

        renderRestaurants(restaurants, map, matchesContainer, token);
    } catch (err) {
        console.error("Failed to load restaurants:", err);
    }
});

function renderRestaurants(restaurants, map, container, token) {
    container.innerHTML = "<h2>Matches</h2>";

    restaurants.forEach((restaurant) => {
        const div = document.createElement("div");
        div.classList.add("match");

        const isFavorited = userFavoriteIds.includes(restaurant._id);

        div.innerHTML = `
            <div class="restaurant-info">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-cuisine">${restaurant.cuisine}</div>
            </div>
            <img src="images/${isFavorited ? 'fav_full' : 'fav_black'}.png" alt="Favorite" class="fav-black" style="cursor:pointer;" data-id="${restaurant._id}" />
        `;

        const heart = div.querySelector(".fav-black");
        heart.addEventListener("click", async (e) => {
            e.stopPropagation();
            try {
                const res = await fetch(`http://localhost:3000/api/users/favorites/${restaurant._id}`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const result = await res.json();
                if (res.ok) {
                    heart.src = result.favorited ? "images/fav_full.png" : "images/fav_black.png";
                    if (result.favorited) {
                        userFavoriteIds.push(restaurant._id);
                    } else {
                        userFavoriteIds = userFavoriteIds.filter(id => id !== restaurant._id);
                    }
                } else {
                    alert("Could not toggle favorite. Try again.");
                }
            } catch (err) {
                console.error("Error toggling favorite:", err);
            }
        });

        div.querySelector(".restaurant-info").addEventListener("click", () => {
            const latlng = [restaurant.coordinates.lat, restaurant.coordinates.lng];

            map.flyTo(latlng, 16, { animate: true, duration: 0.5 });

            setTimeout(() => {
                L.popup({ offset: L.point(0, -25) })
                    .setLatLng(latlng)
                    .setContent(`<strong>${restaurant.name}</strong>`)
                    .openOn(map);
            }, 500);

            showFloatingBox(restaurant);
            currentOpenRestaurantId = restaurant._id;
        });

        container.appendChild(div);

        if (!markers[restaurant._id]) {
            const marker = L.marker([restaurant.coordinates.lat, restaurant.coordinates.lng])
                .addTo(map)
                .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);
            markers[restaurant._id] = marker;
        }
    });
}

function showFloatingBox(restaurant) {
    const floatingBox = document.getElementById("restaurant-floating-box");
    document.getElementById("popup-restaurant-name").textContent = restaurant.name;
    document.getElementById("popup-restaurant-description").textContent = restaurant.description;
    document.getElementById("popup-restaurant-address").innerHTML = `<img src="images/location.png" class="popup-icon" /> ${restaurant.address}`;
    document.getElementById("popup-restaurant-cuisine").innerHTML = `<img src="images/food.png" class="popup-icon" /> ${restaurant.cuisine}`;
    const hours = restaurant.operatingHours;
    document.getElementById("popup-restaurant-hours").innerHTML = `
      <div class="hours-container">
        <img src="images/schedule.png" class="popup-icon" />
        <div class="hours-lines">
          <div>Mon: ${hours.monday}</div>
          <div>Tue: ${hours.tuesday}</div>
          <div>Wed: ${hours.wednesday}</div>
          <div>Thu: ${hours.thursday}</div>
          <div>Fri: ${hours.friday}</div>
          <div>Sat: ${hours.saturday}</div>
          <div>Sun: ${hours.sunday}</div>
        </div>
      </div>
    `;
    document.getElementById("popup-restaurant-phone").innerHTML = `<img src="images/phone.png" class="popup-icon" /> ${restaurant.phone}`;
    document.getElementById("popup-restaurant-website").innerHTML = `
      <div class="website-container">
        <img src="images/web.png" class="popup-icon" />
        <a href="${restaurant.website}" target="_blank">${restaurant.website}</a>
      </div>
    `;
    floatingBox.style.display = "block";
    document.getElementById("popup-close").onclick = () => {
        floatingBox.style.display = "none";
        window.mainMap.closePopup();
        currentOpenRestaurantId = null;
    };
    floatingBox.onclick = e => e.stopPropagation();
}

document.addEventListener("click", e => {
    const floatingBox = document.getElementById("restaurant-floating-box");
    if (floatingBox && floatingBox.style.display === "block" && !floatingBox.contains(e.target)) {
        floatingBox.style.display = "none";
        currentOpenRestaurantId = null;
    }
});

// Search Bar Functionality
const searchInput = document.querySelector(".search-bar input");
const searchButton = document.querySelector(".search-bar button");

if (searchButton && searchInput) {
    searchButton.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        const token = localStorage.getItem("token");
        const matchesContainer = document.querySelector(".matches");
        const map = window.mainMap;

        if (!query || !token || !matchesContainer || !map) return;

        try {
            const response = await fetch(`http://localhost:3000/api/restaurants/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const results = await response.json();

            if (!response.ok) {
                throw new Error(results.message || "Search failed");
            }

            if (!Array.isArray(results)) {
                console.error("Search response is not an array:", results);
                return;
            }

            renderRestaurants(results, map, matchesContainer, token);
        } catch (err) {
            console.error("Search error:", err);
        }
    });
}