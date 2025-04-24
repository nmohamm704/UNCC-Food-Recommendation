// ─────────────────────────────────────────────────────────────────────────────
// Global state
// ─────────────────────────────────────────────────────────────────────────────
let currentOpenRestaurantId = null;
const markers = {};
let userFavoriteIds = [];

// ─────────────────────────────────────────────────────────────────────────────
// Show the detailed floating box next to the sidebar
// ─────────────────────────────────────────────────────────────────────────────
function showFloatingBox(restaurant) {
    const fb         = document.getElementById("restaurant-floating-box");
    const nameEl     = document.getElementById("popup-restaurant-name");
    const descEl     = document.getElementById("popup-restaurant-description");
    const addrEl     = document.getElementById("popup-restaurant-address");
    const cuisineEl  = document.getElementById("popup-restaurant-cuisine");
    const hoursEl    = document.getElementById("popup-restaurant-hours");
    const phoneEl    = document.getElementById("popup-restaurant-phone");
    const webEl      = document.getElementById("popup-restaurant-website");
    const closeBtn   = document.getElementById("popup-close");
    const h = restaurant.operatingHours;

    nameEl.textContent    = restaurant.name;
    descEl.textContent    = restaurant.description;
    addrEl.innerHTML      = `<img src="images/location.png" class="popup-icon"/> ${restaurant.address}`;
    cuisineEl.innerHTML   = `<img src="images/food.png" class="popup-icon"/> ${restaurant.cuisine}`;
    hoursEl.innerHTML     = `
    <div class="hours-container">
      <img src="images/schedule.png" class="popup-icon"/>
      <div class="hours-lines">
        <div>Mon: ${h.monday}</div>
        <div>Tue: ${h.tuesday}</div>
        <div>Wed: ${h.wednesday}</div>
        <div>Thu: ${h.thursday}</div>
        <div>Fri: ${h.friday}</div>
        <div>Sat: ${h.saturday}</div>
        <div>Sun: ${h.sunday}</div>
      </div>
    </div>`;
    phoneEl.innerHTML     = `<img src="images/phone.png" class="popup-icon"/> ${restaurant.phone}`;
    webEl.innerHTML       = `
    <div class="website-container">
      <img src="images/web.png" class="popup-icon"/>
      <a href="${restaurant.website}" target="_blank" class="website-text">${restaurant.website}</a>
    </div>`;

    fb.style.display = "block";

    // Close button: hides both popups
    closeBtn.onclick = () => {
        fb.style.display = "none";
        if (window.mainMap) window.mainMap.closePopup();
        currentOpenRestaurantId = null;
    };

    // Don’t let clicks inside the box bubble up and auto‐close it
    fb.addEventListener("click", e => e.stopPropagation());
}

// ─────────────────────────────────────────────────────────────────────────────
// Render an array of restaurants into the sidebar + map
// ─────────────────────────────────────────────────────────────────────────────
function renderRestaurants(restaurants, map, container, token, filterPopup) {
    container.innerHTML = "<h2>Matches</h2>";

    restaurants.forEach(restaurant => {
        const div = document.createElement("div");
        div.classList.add("match");
        div.innerHTML = `
      <div class="restaurant-info" data-id="${restaurant._id}">
        <div class="restaurant-name">${restaurant.name}</div>
        <div class="restaurant-cuisine">${restaurant.cuisine}</div>
      </div>
      <img
        src="images/${userFavoriteIds.includes(restaurant._id) ? 'fav_full' : 'fav_black'}.png"
        alt="Favorite"
        class="fav-black"
        data-id="${restaurant._id}"
        style="cursor:pointer"
      />
    `;

        // Heart toggle
        const heart = div.querySelector(".fav-black");
        heart.onclick = async e => {
            e.stopPropagation();
            try {
                const res = await fetch(
                    `http://localhost:3000/api/users/favorites/${restaurant._id}`,
                    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
                );
                const result = await res.json();
                if (!res.ok) throw new Error();
                const fav = result.favorited;
                heart.src = fav ? "images/fav_full.png" : "images/fav_black.png";
                if (fav) userFavoriteIds.push(restaurant._id);
                else {
                    userFavoriteIds = userFavoriteIds.filter(id => id !== restaurant._id);
                    if (currentOpenRestaurantId === restaurant._id) {
                        document.getElementById("restaurant-floating-box").style.display = "none";
                        currentOpenRestaurantId = null;
                    }
                }
            } catch {
                alert("Could not toggle favorite. Try again.");
            }
        };

        // Card click: close filter popup, center map, show tiny popup, toggle details box
        const info = div.querySelector(".restaurant-info");
        info.onclick = e => {
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
                map.closePopup();
            } else {
                showFloatingBox(restaurant);
                currentOpenRestaurantId = restaurant._id;
            }
        };

        container.appendChild(div);

        // Add marker if missing
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

// ─────────────────────────────────────────────────────────────────────────────
// Fetch & render restaurants with optional category filters
// ─────────────────────────────────────────────────────────────────────────────
async function loadAndRenderRestaurants(categories, map, container, token, filterPopup) {
    // Clear sidebar + markers
    container.innerHTML = "<h2>Matches</h2>";
    Object.values(markers).forEach(m => map.removeLayer(m));
    Object.keys(markers).forEach(id => delete markers[id]);

    // Build query string
    const qs = categories.length
        ? "?categories=" + categories.map(encodeURIComponent).join(",")
        : "";

    // Fetch
    const resp = await fetch("http://localhost:3000/api/restaurants" + qs, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const restaurants = await resp.json();

    if (!Array.isArray(restaurants) || restaurants.length === 0) {
        container.innerHTML += "<p>No matches found.</p>";
        return;
    }

    renderRestaurants(restaurants, map, container, token, filterPopup);
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch & render search results
// ─────────────────────────────────────────────────────────────────────────────
async function performSearch(query, map, container, token, filterPopup) {
    // Clear sidebar + markers
    container.innerHTML = "<h2>Matches</h2>";
    Object.values(markers).forEach(m => map.removeLayer(m));
    Object.keys(markers).forEach(id => delete markers[id]);

    if (!query) return loadAndRenderRestaurants([], map, container, token, filterPopup);

    try {
        const resp = await fetch(
            `http://localhost:3000/api/restaurants/search?query=${encodeURIComponent(query)}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const results = await resp.json();
        if (!Array.isArray(results) || results.length === 0) {
            container.innerHTML += "<p>No matches found.</p>";
            return;
        }
        renderRestaurants(results, map, container, token, filterPopup);
    } catch (err) {
        console.error("Search error:", err);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Wire everything up on DOMContentLoaded
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    const token            = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");
    const map              = window.mainMap;
    if (!token || !matchesContainer || !map) return;

    // 1) Load user favorites
    try {
        const favResp = await fetch("http://localhost:3000/api/users/favorites", {
            headers: { Authorization: `Bearer ${token}` }
        });
        const favData = await favResp.json();
        if (Array.isArray(favData)) userFavoriteIds = favData.map(f => f._id);
    } catch (err) {
        console.error("Could not load favorites:", err);
    }

    // 2) Filter UI
    const filterHeader      = document.getElementById("filter-header");
    const filterPopup       = document.getElementById("filter-popup");
    const filterOptions     = filterPopup.querySelectorAll(".filter-option");
    const selectedFiltersEl = document.getElementById("selected-filters");
    let   selectedFilters   = [];

    filterHeader.addEventListener("click", e => {
        e.stopPropagation();
        filterPopup.style.display = filterPopup.style.display === "block" ? "none" : "block";
    });
    document.addEventListener("click", () => {
        filterPopup.style.display = "none";
    });
    filterPopup.addEventListener("click", e => e.stopPropagation());

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
            loadAndRenderRestaurants(selectedFilters, map, matchesContainer, token, filterPopup);
        });
    });
    updateFilterChips();

    // 3) Search UI
    const searchInput  = document.querySelector(".search-bar input");
    const searchButton = document.querySelector(".search-bar button");
    if (searchInput && searchButton) {
        searchButton.addEventListener("click", () => {
            const q = searchInput.value.trim();
            performSearch(q, map, matchesContainer, token, filterPopup);
        });
        searchInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                searchButton.click();
            }
        });
    }

    // 4) Initial load
    await loadAndRenderRestaurants([], map, matchesContainer, token, filterPopup);

    // 5) Clicking outside floating box closes it
    document.addEventListener("click", e => {
        const fb = document.getElementById("restaurant-floating-box");
        if (fb && fb.style.display === "block" && !fb.contains(e.target)) {
            fb.style.display = "none";
            currentOpenRestaurantId = null;
        }
    });
});