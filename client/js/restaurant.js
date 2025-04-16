document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");
    const map = window.mainMap; // Reference to the global map object from map.js
    const markers = {}; // Use an object to store markers by restaurant ID

    if (!token || !matchesContainer || !map) return;

    try {
        const response = await fetch("http://localhost:3000/api/restaurants", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
            // Create match card in the sidebar
            const div = document.createElement("div");
            div.classList.add("match");
            div.innerHTML = `
                <img src="images/fav_black.png" alt="fav black" class="fav-black" />
                ${restaurant.name}<br /><span>${restaurant.cuisine}</span>
            `;

            // Handle favorite (heart icon)
            const heart = div.querySelector(".fav-black");
            heart.src = restaurant.favorited ? "images/fav_full.png" : "images/fav_black.png";

            heart.addEventListener("click", async (e) => {
                e.stopPropagation(); // prevent the card click from triggering
                try {
                    const res = await fetch(`http://localhost:3000/api/users/favorites/${restaurant._id}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const result = await res.json();
                    if (res.ok) {
                        heart.src = result.favorited ? "images/fav_full.png" : "images/fav_black.png";
                    } else {
                        alert("Could not toggle favorite. Try again.");
                    }
                } catch (err) {
                    console.error("Error toggling favorite:", err);
                }
            });

            // On card click: fly the map, show Leaflet popup, plus our floating box
            div.addEventListener("click", () => {
                const latlng = [restaurant.coordinates.lat, restaurant.coordinates.lng];

                // Fly the map to the restaurant
                map.flyTo(latlng, 16, {
                    animate: true,
                    duration: 0.5
                });

                // Show the small Leaflet popup on the marker
                setTimeout(() => {
                    L.popup()
                        .setLatLng(latlng)
                        .setContent(`<strong>${restaurant.name}</strong><br>${restaurant.address}`)
                        .openOn(map);
                }, 500);

                // Also show the detailed floating box on top of the map
                showFloatingBox(restaurant);
            });

            matchesContainer.appendChild(div);

            // Add marker to the map if not already existing
            if (!markers[restaurant._id]) {
                const marker = L.marker([restaurant.coordinates.lat, restaurant.coordinates.lng])
                    .addTo(map)
                    .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);
                markers[restaurant._id] = marker;
            }
        });
    } catch (err) {
        console.error("Failed to load restaurants:", err);
    }
});


function showFloatingBox(restaurant) {
    // Grab the floating box elements
    const floatingBox = document.getElementById("restaurant-floating-box");
    const nameElem = document.getElementById("popup-restaurant-name");
    const addressElem = document.getElementById("popup-restaurant-address");
    const cuisineElem = document.getElementById("popup-restaurant-cuisine");
    const descriptionElem = document.getElementById("popup-restaurant-description");
    const hoursElem = document.getElementById("popup-restaurant-hours");
    const phoneElem = document.getElementById("popup-restaurant-phone");
    const websiteElem = document.getElementById("popup-restaurant-website");

    // Fill in the data
    nameElem.textContent = restaurant.name;
    descriptionElem.textContent = `${restaurant.description}`;
    addressElem.innerHTML = `<img src="images/location.png" alt="Address" class="popup-icon" /> ${restaurant.address}`;
    cuisineElem.innerHTML = `<img src="images/food.png" alt="Cuisine" class="popup-icon" /> ${restaurant.cuisine}`;

    // Format operating hours
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

    // Contact details
    phoneElem.innerHTML = `<img src="images/phone.png" alt="Phone" class="popup-icon" /> ${restaurant.phone}`;

    websiteElem.innerHTML = `
  <div class="website-container">
    <img src="images/web.png" alt="Website" class="popup-icon" />
    <a href="${restaurant.website}" target="_blank" class="website-text">${restaurant.website}</a>
  </div>
`;
    // Show the floating box
    floatingBox.style.display = "block";
}