document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            try {
                const response = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (data.success) {
                    localStorage.setItem("loggedIn", "true");
                    window.location.href = "home.html";
                } else {
                    alert(data.message || "Login failed. Please try again.");
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred while logging in.");
            }
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            try {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (data.success) {
                    alert("Account created successfully! Please log in.");
                    window.location.href = "login.html";
                } else {
                    alert(data.message || "Signup failed. Please try again.");
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert("An error occurred while signing up.");
            }
        });
    }
});