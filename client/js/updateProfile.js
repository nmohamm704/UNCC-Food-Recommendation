document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("edit-profile-form");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to update your profile.");
            return;
        }

        const name = document.getElementById("edit-name").value;
        const email = document.getElementById("edit-email").value;
        const password = document.getElementById("edit-password").value;
        const profileImage = document.getElementById("edit-profile-image").files[0];

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        if (password) formData.append("password", password);
        if (profileImage) formData.append("profileImage", profileImage);

        try {
            const response = await fetch("http://localhost:3000/api/users/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Profile updated successfully!");
                window.location.reload(); // or redirect if you prefer
            } else {
                alert(data.message || "Failed to update profile.");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("An error occurred while updating your profile.");
        }
    });
});
