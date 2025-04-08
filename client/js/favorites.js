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
                <div class="restaurant-info">
                    <div class="restaurant-name">${restaurant.name}</div>
                    <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                </div>
                <img src="images/fav_full.png" alt="fav full" class="fav-full" style="cursor:pointer;" data-id="${restaurant._id}" />
            `;

            // Favorite toggle (unfavorite from favorites page)
            const heart = div.querySelector(".fav-full");
            heart.addEventListener("click", async () => {
                try {
                    const res = await fetch(`http://localhost:3000/api/users/favorites/${restaurant._id}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const result = await res.json();
                    if (res.ok && !result.favorited) {
                        div.remove(); // Remove card
                        if (markers[restaurant._id]) {
                            map.removeLayer(markers[restaurant._id]);
                        }
                    } else {
                        alert("Could not unfavorite. Try again.");
                    }
                } catch (err) {
                    console.error("Error unfavoriting:", err);
                }
            });

            // Map zoom on restaurant info click
            div.querySelector(".restaurant-info").addEventListener("click", () => {
                map.setView([restaurant.coordinates.lat, restaurant.coordinates.lng], 16);
                const popup = L.popup()
                    .setLatLng([restaurant.coordinates.lat, restaurant.coordinates.lng])
                    .setContent(`<strong>${restaurant.name}</strong><br>${restaurant.address}`)
                    .openOn(map);
            });

            // Add marker if not already present
            if (!markers[restaurant._id]) {
                const marker = L.marker([restaurant.coordinates.lat, restaurant.coordinates.lng])
                    .addTo(map)
                    .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);

                markers[restaurant._id] = marker;
            }

            matchesContainer.appendChild(div);
        });
    } catch (err) {
        console.error("Failed to load favorites:", err);
    }
});

