document.addEventListener("DOMContentLoaded", function () {
    const settingsIcon = document.getElementById("settings-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

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
});
