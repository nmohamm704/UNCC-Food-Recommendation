let currentOpenRestaurantId = null;
let selectedFilters = [];

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const matchesContainer = document.querySelector(".matches");
    const map = window.mainMap;
    const markers = {};

    if (!token || !matchesContainer || !map) return;

    await loadAndRenderFavorites("", map, matchesContainer, token, markers);

    // Search bar functionality
    const searchInput = document.querySelector(".search-bar input");
    const searchButton = document.querySelector(".search-bar button");

    if (searchInput && searchButton) {
        searchButton.addEventListener("click", async () => {
            const query = searchInput.value.trim();
            await loadAndRenderFavorites(query, map, matchesContainer, token, markers);
        });
    }

    // Filter functionality
    const filterHeader = document.getElementById("filter-header");
    const filterPopup = document.getElementById("filter-popup");
    const filterOptions = filterPopup.querySelectorAll(".filter-option");
    const selectedFiltersEl = document.getElementById("selected-filters");

    if (filterHeader && filterPopup && filterOptions.length) {
        filterHeader.addEventListener("click", (e) => {
            e.stopPropagation();
            filterPopup.style.display = filterPopup.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => {
            filterPopup.style.display = "none";
        });

        filterPopup.addEventListener("click", (e) => e.stopPropagation());

        function updateFilterChips() {
            selectedFiltersEl.innerHTML = "";
            if (selectedFilters.length === 0) {
                selectedFiltersEl.setAttribute("data-placeholder", "No Filters Selected");
                selectedFiltersEl.innerHTML = "No Filters Selected";
            } else {
                selectedFiltersEl.removeAttribute("data-placeholder");
                selectedFilters.forEach((filter) => {
                    const chip = document.createElement("div");
                    chip.className = "filter-option selected";
                    chip.textContent = filter;
                    selectedFiltersEl.appendChild(chip);
                });
            }
        }

        filterOptions.forEach((btn) => {
            btn.addEventListener("click", async () => {
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
                await loadAndRenderFavorites("", map, matchesContainer, token, markers);
            });
        });

        updateFilterChips();
    }
});

async function loadAndRenderFavorites(query, map, container, token, markers) {
    try {
        let url = "http://localhost:3000/api/users/favorites";
        const params = new URLSearchParams();

        if (query) {
            params.append("search", query);
        }
        if (selectedFilters.length > 0) {
            params.append("categories", selectedFilters.join(","));
        }
        if ([...params].length > 0) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const favorites = await response.json();

        if (!Array.isArray(favorites)) {
            console.error("Unexpected response format:", favorites);
            return;
        }

        container.innerHTML = "<h2>Favorites</h2>";

        if (favorites.length === 0) {
            container.innerHTML += "<p>No favorites found.</p>";
            return;
        }

        favorites.forEach((restaurant) => {
            const div = document.createElement("div");
            div.classList.add("match");
            div.innerHTML = `
                <div class="restaurant-info" data-id="${restaurant._id}">
                    <div class="restaurant-top" style="display: flex; align-items: center; gap: 10px;">
                        <img src="images/fav_full.png" alt="Favorite" class="fav-full" style="cursor:pointer; width: 20px; height: 20px;" data-id="${restaurant._id}" />
                        <div class="restaurant-name">${restaurant.name}</div>
                    </div>
                    <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                </div>
            `;

            const heart = div.querySelector(".fav-full");
            heart.addEventListener("click", async (e) => {
                e.stopPropagation();
                try {
                    const res = await fetch(`http://localhost:3000/api/users/favorites/${restaurant._id}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const result = await res.json();
                    if (res.ok && !result.favorited) {
                        div.remove();
                        if (markers[restaurant._id]) map.removeLayer(markers[restaurant._id]);
                        if (currentOpenRestaurantId === restaurant._id) {
                            const floatingBox = document.getElementById("restaurant-floating-box");
                            if (floatingBox) floatingBox.style.display = "none";
                            currentOpenRestaurantId = null;
                        }
                    } else {
                        alert("Could not toggle favorite. Try again.");
                    }
                } catch (err) {
                    console.error("Error unfavoriting:", err);
                }
            });

            div.querySelector(".restaurant-info").addEventListener("click", async () => {
                const latlng = [restaurant.coordinates.lat, restaurant.coordinates.lng];

                map.flyTo(latlng, 16, { animate: true, duration: 0.5 });

                setTimeout(() => {
                    L.popup({ offset: L.point(0, -25), className: 'no-arrow-popup' })
                        .setLatLng(latlng)
                        .setContent(`<strong>${restaurant.name}</strong>`)
                        .openOn(map);
                }, 500);

                const floatingBox = document.getElementById("restaurant-floating-box");
                if (currentOpenRestaurantId === restaurant._id && floatingBox.style.display === "block") {
                    floatingBox.style.display = "none";
                    currentOpenRestaurantId = null;
                } else {
                    try {
                        const res = await fetch(`http://localhost:3000/api/restaurants/${restaurant._id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const fullRestaurant = await res.json();
                        showFloatingBox(fullRestaurant);
                        currentOpenRestaurantId = restaurant._id;
                    } catch (error) {
                        console.error("Failed to load restaurant details:", error);
                    }
                }
            });

            container.appendChild(div);

            if (!markers[restaurant._id]) {
                const marker = L.marker([
                    restaurant.coordinates.lat,
                    restaurant.coordinates.lng
                ]).addTo(map)
                    .bindPopup(`<strong>${restaurant.name}</strong><br>${restaurant.address}`);
                markers[restaurant._id] = marker;
            }
        });
    } catch (err) {
        console.error("Failed to load favorites:", err);
    }
}

function showFloatingBox(restaurant) {
    const floatingBox = document.getElementById("restaurant-floating-box");
    const nameElem = document.getElementById("popup-restaurant-name");
    const addressElem = document.getElementById("popup-restaurant-address");
    const cuisineElem = document.getElementById("popup-restaurant-cuisine");
    const descriptionElem = document.getElementById("popup-restaurant-description");
    const hoursElem = document.getElementById("popup-restaurant-hours");
    const phoneElem = document.getElementById("popup-restaurant-phone");
    const websiteElem = document.getElementById("popup-restaurant-website");

    nameElem.textContent = restaurant.name;
    descriptionElem.textContent = restaurant.description;
    addressElem.innerHTML = `<img src="images/location.png" alt="Address" class="popup-icon" /> ${restaurant.address}`;
    cuisineElem.innerHTML = `<img src="images/food.png" alt="Cuisine" class="popup-icon" /> ${restaurant.cuisine}`;

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

    floatingBox.style.display = "block";

    const closeButton = document.getElementById("popup-close");
    if (closeButton) {
        closeButton.onclick = function () {
            floatingBox.style.display = "none";
            if (window.mainMap) window.mainMap.closePopup();
            currentOpenRestaurantId = null;
        };
    }

    floatingBox.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}


document.addEventListener("click", function (e) {
    const floatingBox = document.getElementById("restaurant-floating-box");
    if (floatingBox && floatingBox.style.display === "block" && !floatingBox.contains(e.target)) {
        floatingBox.style.display = "none";
        currentOpenRestaurantId = null;
    }
});