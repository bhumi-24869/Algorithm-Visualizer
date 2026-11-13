
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Get login details
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const submitButton = loginForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.disabled = true;
    loginMessage.textContent = "Logging in...";

    try {

        // Send login request to Flask
        const response = await fetch(
            "http://127.0.0.1:5000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.json();

        // Check login response
        if (!response.ok) {
            throw new Error(
                result.error || "Login failed."
            );
        }

        loginMessage.textContent =
            "Login successful! Redirecting to homepage...";

        // Redirect after successful login
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    }

    catch (error) {

        console.error("Login Error:", error);

        loginMessage.textContent = error.message;

    }

    finally {

        submitButton.disabled = false;

    }

});
