document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view your profile.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok || !data.name || !data.email) {
            throw new Error(data.message || "Failed to fetch user profile.");
        }

        // Center info
        document.getElementById("user-name").textContent = data.name;
        document.getElementById("user-email").textContent = `Email: ${data.email}`;
        document.getElementById("user-password").textContent = `Password: **********`;

        // Center image (if data.profileImage is the same or separate from top-right)
        if (data.profileImage) {
            const centerPic = document.getElementById("profile-image");
            centerPic.src = `http://localhost:3000${data.profileImage}`;
            centerPic.style.visibility = "visible";
        }
    } catch (error) {
        console.warn("Error loading profile:", error);
    }
});