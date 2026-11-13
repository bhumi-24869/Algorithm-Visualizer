
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const button = loginForm.querySelector('button[type="submit"]');

    button.disabled = true;
    loginMessage.textContent = "Logging in...";

    try {
        const response = await fetch("http://127.0.0.1:5000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Login failed");
        }

        loginMessage.textContent = "Login successful!";

        window.location.href = "index.html";

    } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent = error.message;

    } finally {
        button.disabled = false;
    }
});
