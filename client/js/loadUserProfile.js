document.addEventListener("DOMContentLoaded", async () => {
    // Get the navbar profile image element
    const navPicElement = document.getElementById("profile-picture-nav");
    // Get the settings dropdown profile image element (ensure its ID is "profile-picture-settings" in your HTML)
    const settingsPicElement = document.getElementById("profile-picture-settings");
    const dropdownUsernameElement = document.getElementById("dropdown-username");
    if (!navPicElement && !settingsPicElement) return; // if neither exists, abort

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:3000/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            if (data.profileImage) {
                const imageUrl = `http://localhost:3000${data.profileImage}`;

                if (navPicElement) {
                    navPicElement.onload = () => {
                        navPicElement.style.visibility = "visible";
                    };
                    navPicElement.src = imageUrl;
                }

                if (settingsPicElement) {
                    settingsPicElement.onload = () => {
                        settingsPicElement.style.visibility = "visible";
                    };
                    settingsPicElement.src = imageUrl;
                }
            }
            // Update the dropdown username if available
            if (data.name && dropdownUsernameElement) {
                dropdownUsernameElement.textContent = data.name;
            }
        }
    } catch (err) {
        console.error("Failed to load profile image:", err);
    }
});