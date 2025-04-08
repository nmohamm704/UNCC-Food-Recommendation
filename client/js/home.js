document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");

    if (!token || !matchesContainer) return;

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

    // Initialize the map
        const map = window.mainMap; // Default position

    // Add tile layer to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
}).addTo(map);

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

    const heart = div.querySelector(".fav-full");

    // Favorite logic
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
    div.remove(); // Remove from the UI
} else {
    alert("Could not unfavorite. Try again.");
}
} catch (err) {
    console.error("Error unfavoriting:", err);
}
});

    // Restaurant box click will update the map
    div.querySelector(".restaurant-info").addEventListener("click", () => {
    map.setView([restaurant.coordinates.lat, restaurant.coordinates.lng], 15);
    const marker = L.marker([restaurant.coordinates.lat, restaurant.coordinates.lng]).addTo(map);
    marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.cuisine}`).openPopup();
});

    matchesContainer.appendChild(div);
});
} catch (err) {
    console.error("Failed to load favorites:", err);
}
});

    // Toggle settings dropdown
    document.getElementById("settings-icon").addEventListener("click", () => {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});