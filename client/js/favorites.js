// Global variable to track which restaurant is currently shown in the floating box
let currentOpenRestaurantId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");
    const map = window.mainMap; // From map.js
    const markers = {}; // Prevent duplicate markers

    if (!token || !matchesContainer || !map) return;

    try {
        const response = await fetch("http://localhost:3000/api/users/favorites", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const favorites = await response.json();

        if (!Array.isArray(favorites)) {
            console.error("Unexpected response format:", favorites);
            return;
        }

        if (favorites.length === 0) {
            matchesContainer.innerHTML += "<p>No favorites found.</p>";
            return;
        }

        // Clear previous matches if any
        matchesContainer.innerHTML = "<h2>Favorites</h2>";

        favorites.forEach((restaurant) => {
            const div = document.createElement("div");
            div.classList.add("match");
            div.innerHTML = `
                <div class="restaurant-info" data-id="${restaurant._id}">
                    <div class="restaurant-name">${restaurant.name}</div>
                    <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                </div>
                <img src="images/fav_full.png" alt="fav full" class="fav-full" style="cursor:pointer;" data-id="${restaurant._id}" />
            `;

            // Unfavorite functionality
            const heart = div.querySelector(".fav-full");
            heart.addEventListener("click", async (e) => {
                e.stopPropagation(); // Prevent the card click from firing
                try {
                    const res = await fetch(`http://localhost:3000/api/users/favorites/${restaurant._id}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const result = await res.json();
                    if (res.ok && !result.favorited) {
                        // Remove the restaurant card from the UI
                        div.remove();
                        if (markers[restaurant._id]) {
                            map.removeLayer(markers[restaurant._id]);
                        }
                        // If this restaurant's popup is open, close it
                        if (currentOpenRestaurantId === restaurant._id) {
                            const floatingBox = document.getElementById("restaurant-floating-box");
                            if (floatingBox) {
                                floatingBox.style.display = "none";
                            }
                            currentOpenRestaurantId = null;
                        }
                    } else {
                        alert("Could not toggle favorite. Try again.");
                    }
                } catch (err) {
                    console.error("Error unfavoriting:", err);
                }
            });

            // On clicking the restaurant info
            const restaurantInfo = div.querySelector(".restaurant-info");
            restaurantInfo.addEventListener("click", (e) => {
                e.stopPropagation();
                const latlng = [restaurant.coordinates.lat, restaurant.coordinates.lng];

                // Fly the map to the restaurant location
                map.flyTo(latlng, 16, {
                    animate: true,
                    duration: 0.5,
                });

                // Open the small Leaflet popup (name and address)
                setTimeout(() => {
                    L.popup({
                        // Shift popup above the pin by 20px (tweak as needed)
                        offset: L.point(0, -25),
                        className: 'no-arrow-popup'
                    })
                        .setLatLng(latlng)
                        .setContent(`<strong>${restaurant.name}</strong>`)
                        .openOn(map);
                }, 500);

                // Toggle the detailed sidebar popup:
                const floatingBox = document.getElementById("restaurant-floating-box");
                if (currentOpenRestaurantId === restaurant._id && floatingBox.style.display === "block") {
                    // If the same restaurant is already open, close the popup
                    floatingBox.style.display = "none";
                    currentOpenRestaurantId = null;
                } else {
                    // Show the popup with this restaurant's details
                    showFloatingBox(restaurant);
                    currentOpenRestaurantId = restaurant._id;
                }
            });

            matchesContainer.appendChild(div);

            // Add a marker on the map if not already present
            if (!markers[restaurant._id]) {
                const marker = L.marker([
                    restaurant.coordinates.lat,
                    restaurant.coordinates.lng,
                ])
                    .addTo(map)
                    .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);
                markers[restaurant._id] = marker;
            }
        });
    } catch (err) {
        console.error("Failed to load favorites:", err);
    }
});

// Function to show the sidebar popup with detailed restaurant info
function showFloatingBox(restaurant) {
    // Get the floating box elements by their IDs
    const floatingBox = document.getElementById("restaurant-floating-box");
    const nameElem = document.getElementById("popup-restaurant-name");
    const addressElem = document.getElementById("popup-restaurant-address");
    const cuisineElem = document.getElementById("popup-restaurant-cuisine");
    const descriptionElem = document.getElementById("popup-restaurant-description");
    const hoursElem = document.getElementById("popup-restaurant-hours");
    const phoneElem = document.getElementById("popup-restaurant-phone");
    const websiteElem = document.getElementById("popup-restaurant-website");

    // Update the floating box content with restaurant details
    nameElem.textContent = restaurant.name;
    descriptionElem.textContent = `${restaurant.description}`;
    addressElem.innerHTML = `<img src="images/location.png" alt="Address" class="popup-icon" /> ${restaurant.address}`;
    cuisineElem.innerHTML = `<img src="images/food.png" alt="Cuisine" class="popup-icon" /> ${restaurant.cuisine}`;

    // Format operating hours using a flex container
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

    phoneElem.innerHTML = `<img src="images/phone.png" alt="Phone" class="popup-icon" /> ${restaurant.phone}`;
    websiteElem.innerHTML = `
      <div class="website-container">
        <img src="images/web.png" alt="Website" class="popup-icon" />
        <a href="${restaurant.website}" target="_blank" class="website-text">${restaurant.website}</a>
      </div>
    `;

    // Show the floating box
    floatingBox.style.display = "block";

    const closeButton = document.getElementById("popup-close");
    if (closeButton) {
        closeButton.onclick = function () {
            floatingBox.style.display = "none";
            if (window.mainMap) {
                window.mainMap.closePopup();
            }
            currentOpenRestaurantId = null;
        };
    }

    // Prevent clicks inside the floating box from hiding it
    floatingBox.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

// Document-level click to hide the floating box when clicking outside it
document.addEventListener("click", function (e) {
    const floatingBox = document.getElementById("restaurant-floating-box");
    if (floatingBox && floatingBox.style.display === "block" && !floatingBox.contains(e.target)) {
        floatingBox.style.display = "none";
        currentOpenRestaurantId = null;
    }
});