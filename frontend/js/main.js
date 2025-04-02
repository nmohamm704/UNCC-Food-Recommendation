document.addEventListener("DOMContentLoaded", function () {
    // Toggle settings dropdown
    const settingsIcon = document.getElementById("settings-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (settingsIcon && dropdownMenu) {
        settingsIcon.addEventListener("click", function (event) {
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
            event.stopPropagation();
        });

        document.addEventListener("click", function () {
            dropdownMenu.style.display = "none";
        });

        dropdownMenu.addEventListener("click", function (event) {
            event.stopPropagation();
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

    // Filter Dropdown Toggle
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
});
