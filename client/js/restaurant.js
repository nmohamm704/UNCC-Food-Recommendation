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
            // Create a match card in the sidebar for each restaurant
            const div = document.createElement("div");
            div.classList.add("match");
            div.innerHTML = `
                <img src="images/fav_black.png" alt="fav black" class="fav-black" />
                ${restaurant.name}<br /><span>${restaurant.cuisine}</span>
            `;

            const heart = div.querySelector(".fav-black");

            // Set heart icon based on favorite status
            heart.src = restaurant.favorited ? "images/fav_full.png" : "images/fav_black.png";

            // On heart click, toggle favorite state
            heart.addEventListener("click", async (e) => {
                e.stopPropagation(); // prevent the card click from firing
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

            // On click, center the map and show both the map popup and the sidebar detailed popup
            div.addEventListener("click", () => {
                const latlng = [restaurant.coordinates.lat, restaurant.coordinates.lng];

                // Fly the map to the restaurant location
                map.flyTo(latlng, 16, {
                    animate: true,
                    duration: 0.5 // in seconds (optional)
                });

                // Open a small Leaflet popup showing name and address (over the map)
                setTimeout(() => {
                    L.popup()
                        .setLatLng(latlng)
                        .setContent(`<strong>${restaurant.name}</strong><br>${restaurant.address}`)
                        .openOn(map);
                }, 500); // matches the duration of the flyTo animation

                // Additionally, show the sidebar popup with detailed info
                showSidebarPopup(restaurant);
            });

            matchesContainer.appendChild(div);

            // Add a marker on the map for each restaurant if not already added
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
        console.error("Failed to load restaurants:", err);
    }
});

// Function to show the sidebar popup with detailed restaurant info
function showSidebarPopup(restaurant) {
    // Get sidebar popup elements by their IDs (make sure these IDs exist in your HTML)
    const sidebarPopup = document.getElementById("restaurant-sidebar-popup");
    const closeBtn = document.getElementById("sidebar-popup-close");
    const nameElem = document.getElementById("sidebar-popup-restaurant-name");
    const addressElem = document.getElementById("sidebar-popup-restaurant-address");
    const cuisineElem = document.getElementById("sidebar-popup-restaurant-cuisine");
    const descriptionElem = document.getElementById("sidebar-popup-restaurant-description");
    const hoursElem = document.getElementById("sidebar-popup-restaurant-hours");
    const contactElem = document.getElementById("sidebar-popup-restaurant-contact");

    // Update the popup’s content with restaurant details
    nameElem.textContent = restaurant.name;
    addressElem.textContent = `Address: ${restaurant.address}`;
    cuisineElem.textContent = `Cuisine: ${restaurant.cuisine}`;
    descriptionElem.textContent = `Description: ${restaurant.description}`;

    // Format operating hours (customize as needed)
    const hours = restaurant.operatingHours;
    hoursElem.textContent = `Hours: Mon: ${hours.monday}, Tue: ${hours.tuesday}, Wed: ${hours.wednesday}, Thu: ${hours.thursday}, Fri: ${hours.friday}, Sat: ${hours.saturday}, Sun: ${hours.sunday}`;

    // Combine contact details (e.g., phone and website)
    contactElem.textContent = `Contact: ${restaurant.phone} | ${restaurant.website}`;

    // Show the sidebar popup by setting its display to block
    sidebarPopup.style.display = "block";

    // Attach an event handler to the close button to hide the popup when clicked
    closeBtn.onclick = function() {
        sidebarPopup.style.display = "none";
    };
}