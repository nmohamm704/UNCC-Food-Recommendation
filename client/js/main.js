document.addEventListener("DOMContentLoaded", () => {
    console.log("main.js loaded");

    const settingsIcon = document.getElementById("settings-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    console.log("Settings Icon:", settingsIcon);
    console.log("Dropdown Menu:", dropdownMenu);

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
});