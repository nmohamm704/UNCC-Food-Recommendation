// ─────────────────────────────────────────────────────────────────────────────
// Global state
// ─────────────────────────────────────────────────────────────────────────────
let currentOpenRestaurantId = null;

// ─────────────────────────────────────────────────────────────────────────────
// Function to show the floating details box next to the sidebar
// ─────────────────────────────────────────────────────────────────────────────
function showFloatingBox(restaurant) {
    const floatingBox    = document.getElementById("restaurant-floating-box");
    const nameElem       = document.getElementById("popup-restaurant-name");
    const descElem       = document.getElementById("popup-restaurant-description");
    const addressElem    = document.getElementById("popup-restaurant-address");
    const cuisineElem    = document.getElementById("popup-restaurant-cuisine");
    const hoursElem      = document.getElementById("popup-restaurant-hours");
    const phoneElem      = document.getElementById("popup-restaurant-phone");
    const websiteElem    = document.getElementById("popup-restaurant-website");
    const closeBtn       = document.getElementById("popup-close");
    const hours          = restaurant.operatingHours;

    // Fill in content
    nameElem.textContent        = restaurant.name;
    descElem.textContent        = restaurant.description;
    addressElem.innerHTML       = `<img src="images/location.png" class="popup-icon" /> ${restaurant.address}`;
    cuisineElem.innerHTML       = `<img src="images/food.png" class="popup-icon" /> ${restaurant.cuisine}`;
    hoursElem.innerHTML         = `
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
    </div>`;
    phoneElem.innerHTML         = `<img src="images/phone.png" class="popup-icon" /> ${restaurant.phone}`;
    websiteElem.innerHTML       = `
    <div class="website-container">
      <img src="images/web.png" class="popup-icon" />
      <a href="${restaurant.website}" target="_blank" class="website-text">${restaurant.website}</a>
    </div>`;

    // Show box
    floatingBox.style.display = "block";

    // Close button hides both popups
    if (closeBtn) {
        closeBtn.onclick = () => {
            floatingBox.style.display = "none";
            if (window.mainMap) window.mainMap.closePopup();
            currentOpenRestaurantId = null;
        };
    }

    // Prevent clicks inside from bubbling-up and closing it
    floatingBox.addEventListener("click", e => e.stopPropagation());
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry — wire everything when DOM is ready
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    // 1️⃣ Grab essentials
    const token            = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");
    const map              = window.mainMap;    // from map.js
    const markers          = {};                // store L.marker instances
    let   userFavoriteIds  = [];                // filled below
    let   selectedFilters  = [];                // in-memory filter state

    if (!token || !matchesContainer || !map) return;

    // 2️⃣ Load the user’s favorites
    try {
        const favResp = await fetch("http://localhost:3000/api/users/favorites", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const favData = await favResp.json();
        if (Array.isArray(favData)) {
            userFavoriteIds = favData.map(f => f._id);
        }
    } catch (err) {
        console.error("Could not load favorites:", err);
    }

    // 3️⃣ Wire up the filter UI
    const filterHeader      = document.getElementById("filter-header");
    const filterPopup       = document.getElementById("filter-popup");
    const filterOptions     = filterPopup.querySelectorAll(".filter-option");
    const selectedFiltersEl = document.getElementById("selected-filters");

    // Toggle popup
    filterHeader.addEventListener("click", e => {
        e.stopPropagation();
        filterPopup.style.display = filterPopup.style.display === "block" ? "none" : "block";
    });
    // Close if clicking elsewhere
    document.addEventListener("click", () => filterPopup.style.display = "none");
    // Don’t close when clicking inside
    filterPopup.addEventListener("click", e => e.stopPropagation());

    // Toggle each filter option
    filterOptions.forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.dataset.value;
            const idx = selectedFilters.indexOf(val);
            if (idx === -1) {
                selectedFilters.push(val);
                btn.classList.add("selected");
            } else {
                selectedFilters.splice(idx, 1);
                btn.classList.remove("selected");
            }
            updateFilterChips();
            loadAndRenderRestaurants(selectedFilters);
        });
    });

    // Show “No Filters Selected” or the active chips
    function updateFilterChips() {
        selectedFiltersEl.innerHTML = "";
        if (selectedFilters.length === 0) {
            selectedFiltersEl.setAttribute("data-placeholder", "No Filters Selected");
        } else {
            selectedFiltersEl.removeAttribute("data-placeholder");
            selectedFilters.forEach(f => {
                const chip = document.createElement("div");
                chip.className = "filter-option selected";
                chip.textContent = f;
                selectedFiltersEl.appendChild(chip);
            });
        }
    }
    updateFilterChips();

    // 4️⃣ Fetch & render loop (clears old, applies filters, repopulates)
    async function loadAndRenderRestaurants(categories = []) {
        // Clear sidebar & markers
        matchesContainer.innerHTML = "<h2>Matches</h2>";
        Object.values(markers).forEach(m => map.removeLayer(m));
        Object.keys(markers).forEach(id => delete markers[id]);

        // Build query string
        const qs = categories.length
            ? "?categories=" + categories.map(encodeURIComponent).join(",")
            : "";

        // Fetch restaurants
        const resp = await fetch("http://localhost:3000/api/restaurants" + qs, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const restaurants = await resp.json();

        // No results?
        if (!Array.isArray(restaurants) || restaurants.length === 0) {
            matchesContainer.innerHTML += "<p>No matches found.</p>";
            return;
        }

        // Render each restaurant
        restaurants.forEach(restaurant => {
            // Sidebar card
            const div = document.createElement("div");
            div.classList.add("match");
            div.innerHTML = `
        <div class="restaurant-info" data-id="${restaurant._id}">
          <div class="restaurant-name">${restaurant.name}</div>
          <div class="restaurant-cuisine">${restaurant.cuisine}</div>
        </div>
        <img
          src="images/fav_black.png"
          alt="fav heart"
          class="fav-black"
          data-id="${restaurant._id}"
          style="cursor:pointer"
        />
      `;

            // Heart toggle
            const heart = div.querySelector(".fav-black");
            const isFav = userFavoriteIds.includes(restaurant._id);
            heart.src = isFav ? "images/fav_full.png" : "images/fav_black.png";
            heart.addEventListener("click", async e => {
                e.stopPropagation();
                try {
                    const toggle = await fetch(
                        `http://localhost:3000/api/users/favorites/${restaurant._id}`,
                        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
                    );
                    const result = await toggle.json();
                    if (!toggle.ok) throw new Error();
                    const fav = result.favorited;
                    heart.src = fav ? "images/fav_full.png" : "images/fav_black.png";

                    // If unfavorited while its details box is open, close it
                    if (!fav && currentOpenRestaurantId === restaurant._id) {
                        document.getElementById("restaurant-floating-box").style.display = "none";
                        currentOpenRestaurantId = null;
                    }

                    // Keep the favorites array in sync
                    if (fav) userFavoriteIds.push(restaurant._id);
                    else userFavoriteIds = userFavoriteIds.filter(id => id !== restaurant._id);
                } catch {
                    alert("Could not toggle favorite. Try again.");
                }
            });

            // Clicking the card: fly, tiny popup, toggle details box
            const info = div.querySelector(".restaurant-info");
            info.addEventListener("click", e => {
                e.stopPropagation();
                filterPopup.style.display = "none";
                const latlng = [restaurant.coordinates.lat, restaurant.coordinates.lng];

                map.flyTo(latlng, 16, { animate: true, duration: 0.5 });
                setTimeout(() => {
                    L.popup({ offset: L.point(0, -25), className: "no-arrow-popup" })
                        .setLatLng(latlng)
                        .setContent(`<strong>${restaurant.name}</strong>`)
                        .openOn(map);
                }, 500);

                const fb = document.getElementById("restaurant-floating-box");
                if (currentOpenRestaurantId === restaurant._id && fb.style.display === "block") {
                    fb.style.display = "none";
                    currentOpenRestaurantId = null;
                } else {
                    showFloatingBox(restaurant);
                    currentOpenRestaurantId = restaurant._id;
                }
            });

            matchesContainer.appendChild(div);

            // Add map marker if needed
            if (!markers[restaurant._id]) {
                markers[restaurant._id] = L.marker([
                    restaurant.coordinates.lat,
                    restaurant.coordinates.lng
                ])
                    .addTo(map)
                    .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);
            }
        });
    }

    // 5️⃣ Kick off the first render
    await loadAndRenderRestaurants(selectedFilters);
});