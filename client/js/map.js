document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("map").setView([35.3076, -80.7336], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
});
