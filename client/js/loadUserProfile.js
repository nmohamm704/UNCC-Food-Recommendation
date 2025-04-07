document.addEventListener("DOMContentLoaded", async () => {
    const profilePicElement = document.getElementById("profile-picture-nav");
    if (!profilePicElement) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:3000/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok && data.profileImage) {
            const topRightUrl = `http://localhost:3000${data.profileImage}`;
            profilePicElement.onload = () => {
                profilePicElement.style.visibility = "visible";
            };
            profilePicElement.src = topRightUrl;
        }
    } catch (err) {
        console.error("Failed to load profile image:", err);
    }
});