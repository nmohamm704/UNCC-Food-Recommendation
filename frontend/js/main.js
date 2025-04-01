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
            } else if (heart.getAttribute("src").includes("fav_full.png")) {
                heart.setAttribute("src", "../images/fav_black.png"); // Change full heart to empty heart
            } else if (heart.getAttribute("src").includes("fav_black.png")) {
                heart.setAttribute("src", "../images/fav_full.png"); // Change empty heart back to full heart
            }
        });
    });
});
