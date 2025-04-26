document.addEventListener("DOMContentLoaded", () => {
    console.log("main.js loaded");

    // Toggle settings dropdown
    const settingsIcon = document.getElementById("settings-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    console.log("Settings Icon:", settingsIcon);
    console.log("Dropdown Menu:", dropdownMenu);

    if (settingsIcon && dropdownMenu) {
        settingsIcon.addEventListener("click", function (event) {
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
            event.stopPropagation(); // Prevents click from closing immediately
        });

        document.addEventListener("click", function () {
            dropdownMenu.style.display = "none"; // Close if clicked outside
        });

        dropdownMenu.addEventListener("click", function (event) {
            event.stopPropagation(); // Keep open when clicking inside
        });
    }

    // Favorite heart toggle (Handles both black and full hearts)
    const hearts = document.querySelectorAll(".fav-black, .fav-full");

    hearts.forEach(heart => {
        heart.addEventListener("click", function () {
            if (heart.getAttribute("src").includes("fav_black.png")) {
                heart.setAttribute("src", "../images/fav_full.png"); // Change black heart to full heart
            } else {
                heart.setAttribute("src", "../images/fav_black.png"); // Change full heart to black heart
            }
        });
    });

    // filter

    const filterBtn = document.querySelector(".filter-btn");
    const filterDropdown = document.getElementById("filterDropdown");

    if (filterBtn && filterDropdown) {
        filterBtn.addEventListener("click", function (event) {
            filterDropdown.style.display = filterDropdown.style.display === "block" ? "none" : "block";
            event.stopPropagation(); // Prevents closing when clicking the button
        });

        document.addEventListener("click", function () {
            filterDropdown.style.display = "none";
        });

        filterDropdown.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevents dropdown from closing when clicking inside
        });
    }

    // === NEW: Toggle between Sidebar and Map (only on mobile) ===
    const toggle = document.getElementById("my-toggle");
    const sidebar = document.getElementById("side");
    const mapContainer = document.querySelector("main");

    function updateView() {
        if (window.innerWidth <= 480) { // Only activate on mobile screens
            if (toggle.checked) {
                sidebar.style.display = "none";
                mapContainer.style.display = "flex";
            } else {
                sidebar.style.display = "flex";
                mapContainer.style.display = "none";
            }
        } else {
            // Desktop mode: always show both
            sidebar.style.display = "flex";
            mapContainer.style.display = "flex";
        }
    }

    if (toggle && sidebar && mapContainer) {
        updateView();
        toggle.addEventListener("change", updateView);
        window.addEventListener("resize", updateView); // Also update if screen size changes
    }
});