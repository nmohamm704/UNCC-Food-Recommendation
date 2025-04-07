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

            const heart = div.querySelector(".fav-black");

            // Check if the restaurant is already favorited (you could track this state based on the user's favorites)
            heart.src = restaurant.favorited ? "images/fav_full.png" : "images/fav_black.png"; // Change the heart icon based on favorite status

            // On heart click, toggle favorite
            heart.addEventListener("click", async () => {
                try {
                    const res = await fetch(`http://localhost:3000/api/users/favorites/${restaurant._id}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const result = await res.json();
                    if (res.ok) {
                        // Toggle the heart icon
                        heart.src = result.favorited ? "images/fav_full.png" : "images/fav_black.png";

                        // Optionally update the favorites list in the UI
                        if (result.favorited) {
                            // Add to favorites page or trigger re-fetch of the favorites
                        } else {
                            // Remove from favorites page or trigger re-fetch of the favorites
                        }
                    } else {
                        alert("Could not toggle favorite. Try again.");
                    }
                } catch (err) {
                    console.error("Error favoriting/unfavoriting:", err);
                }
            });

            // On click, center the map and show a popup
            div.addEventListener("click", () => {
                map.setView(
                    [restaurant.coordinates.lat, restaurant.coordinates.lng],
                    16
                );
                L.popup()
                    .setLatLng([restaurant.coordinates.lat, restaurant.coordinates.lng])
                    .setContent(`<strong>${restaurant.name}</strong><br>${restaurant.address}`)
                    .openOn(map);
            });

            matchesContainer.appendChild(div);

            // Add a marker on the map if not already added
            if (!markers[restaurant._id]) {
                const marker = L.marker([
                    restaurant.coordinates.lat,
                    restaurant.coordinates.lng,
                ])
                    .addTo(map)
                    .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);

                markers[restaurant._id] = marker; // Store the marker by restaurant ID
            }
        });
    } catch (err) {
        console.error("Failed to load restaurants:", err);
    }
});