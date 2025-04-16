document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");
    const map = window.mainMap; // Reference to the global map object from map.js
    const markers = {}; // Use an object to store markers by restaurant ID

    if (!token || !matchesContainer || !map) return;

    // First, fetch the user's favorites so that we know which restaurant IDs are favorited
    let userFavoriteIds = [];
    try {
        const favResponse = await fetch("http://localhost:3000/api/users/favorites", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const favData = await favResponse.json();
        if (Array.isArray(favData)) {
            // Assumes each favorite has an _id property
            userFavoriteIds = favData.map(fav => fav._id);
        }
    } catch (favErr) {
        console.error("Failed to load user's favorites:", favErr);
    }

    // Now, fetch all restaurants
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

        restaurants.forEach((restaurant) => {
            // Create match card in the sidebar for each restaurant
            const div = document.createElement("div");
            div.classList.add("match");
            div.innerHTML = `
                <div class="restaurant-info" data-id="${restaurant._id}">
                    <div class="restaurant-name">${restaurant.name}</div>
                    <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                </div>
                <img src="images/fav_black.png" alt="fav black" class="fav-black" style="cursor:pointer;" data-id="${restaurant._id}" />
            `;

            // Handle favorite heart image based on whether the restaurant is in the user's favorites
            const heart = div.querySelector(".fav-black");
            const isFavorited = userFavoriteIds.includes(restaurant._id);
            heart.src = isFavorited ? "images/fav_full.png" : "images/fav_black.png";

            // Toggle favorite on heart click
            heart.addEventListener("click", async (e) => {
                e.stopPropagation(); // Prevent the card click from firing
                try {
                    const res = await fetch(`http://localhost:3000/api/users/favorites/${restaurant._id}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const result = await res.json();
                    if (res.ok) {
                        // Update heart icon based on result.favorited
                        const favorited = result.favorited;
                        heart.src = favorited ? "images/fav_full.png" : "images/fav_black.png";
                        // Also, if currently displaying this restaurant in the floating box and now it's unfavorited, hide it.
                        if (!favorited && currentOpenRestaurantId === restaurant._id) {
                            document.getElementById("restaurant-floating-box").style.display = "none";
                            currentOpenRestaurantId = null;
                        }
                        // Optionally, update userFavoriteIds (if you intend to use it for subsequent checks)
                        if (favorited && !userFavoriteIds.includes(restaurant._id)) {
                            userFavoriteIds.push(restaurant._id);
                        } else if (!favorited) {
                            userFavoriteIds = userFavoriteIds.filter(id => id !== restaurant._id);
                        }
                    } else {
                        alert("Could not toggle favorite. Try again.");
                    }
                } catch (err) {
                    console.error("Error toggling favorite:", err);
                }
            });

            // On clicking the restaurant info: zoom map, show map popup, and toggle the detailed floating box
            const restaurantInfo = div.querySelector(".restaurant-info");
            restaurantInfo.addEventListener("click", (e) => {
                e.stopPropagation();
                const latlng = [restaurant.coordinates.lat, restaurant.coordinates.lng];

                // Fly the map to the restaurant location
                map.flyTo(latlng, 16, {
                    animate: true,
                    duration: 0.5,
                });

                // Open a small Leaflet popup showing the restaurant name and address
                setTimeout(() => {
                    L.popup()
                        .setLatLng(latlng)
                        .setContent(`<strong>${restaurant.name}</strong><br>${restaurant.address}`)
                        .openOn(map);
                }, 500);

                // Toggle the detailed floating box: close if the same restaurant is clicked again
                const floatingBox = document.getElementById("restaurant-floating-box");
                if (currentOpenRestaurantId === restaurant._id && floatingBox.style.display === "block") {
                    floatingBox.style.display = "none";
                    currentOpenRestaurantId = null;
                } else {
                    showFloatingBox(restaurant);
                    currentOpenRestaurantId = restaurant._id;
                }
            });

            matchesContainer.appendChild(div);

            // Add a marker on the map for this restaurant if not already added
            if (!markers[restaurant._id]) {
                const marker = L.marker([
                    restaurant.coordinates.lat,
                    restaurant.coordinates.lng,
                ]).addTo(map)
                    .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);
                markers[restaurant._id] = marker;
            }
        });
    } catch (err) {
        console.error("Failed to load restaurants:", err);
    }
});

// Global variable to track the currently open restaurant popup
let currentOpenRestaurantId = null;

// Function to show the floating sidebar popup with detailed restaurant info
function showFloatingBox(restaurant) {
    // Grab the floating box elements by their IDs
    const floatingBox = document.getElementById("restaurant-floating-box");
    const nameElem = document.getElementById("popup-restaurant-name");
    const addressElem = document.getElementById("popup-restaurant-address");
    const cuisineElem = document.getElementById("popup-restaurant-cuisine");
    const descriptionElem = document.getElementById("popup-restaurant-description");
    const hoursElem = document.getElementById("popup-restaurant-hours");
    const phoneElem = document.getElementById("popup-restaurant-phone");
    const websiteElem = document.getElementById("popup-restaurant-website");

    // Update the popup content with restaurant details
    nameElem.textContent = restaurant.name;
    descriptionElem.textContent = `${restaurant.description}`;
    addressElem.innerHTML = `<img src="images/location.png" alt="Address" class="popup-icon" /> ${restaurant.address}`;
    cuisineElem.innerHTML = `<img src="images/food.png" alt="Cuisine" class="popup-icon" /> ${restaurant.cuisine}`;

    // Format operating hours using a flex container for a multi-line layout
    const hours = restaurant.operatingHours;
    hoursElem.innerHTML = `
      <div class="hours-container">
        <img src="images/schedule.png" alt="Hours" class="popup-icon" />
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

    // Separate phone details and website details
    phoneElem.innerHTML = `<img src="images/phone.png" alt="Phone" class="popup-icon" /> ${restaurant.phone}`;
    websiteElem.innerHTML = `
      <div class="website-container">
        <img src="images/web.png" alt="Website" class="popup-icon" />
        <a href="${restaurant.website}" target="_blank" class="website-text">${restaurant.website}</a>
      </div>
    `;

    // Show the floating box
    floatingBox.style.display = "block";

    // Prevent clicks inside the floating box from bubbling up (which could close it)
    floatingBox.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

// Hide the floating box when clicking outside of it
document.addEventListener("click", function (e) {
    const floatingBox = document.getElementById("restaurant-floating-box");
    if (floatingBox && floatingBox.style.display === "block" && !floatingBox.contains(e.target)) {
        floatingBox.style.display = "none";
        currentOpenRestaurantId = null;
    }
});