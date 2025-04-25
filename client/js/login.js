document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3000/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem("token", data.token);
                    alert("Login successful!");
                    window.location.href = "home.html";
                } else {
                    showErrors(data);
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred while logging in.");
            }
        });
    }
});