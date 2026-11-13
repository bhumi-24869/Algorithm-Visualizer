const signupForm = document.getElementById("signup-form");
const signupMessage = document.getElementById("signup-message");
signupForm.addEventListener("submit", async function(event) {
    // Prevent page refresh
    event.preventDefault();

    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirm-password").value;

    // Check passwords
    if (password !== confirmPassword) {
        signupMessage.textContent = "Passwords do not match!";

        return;
    }

    // Check password length
    if (password.length < 8) {
        signupMessage.textContent =
            "Password must contain at least 8 characters.";

        return;
    }

    // Disable button while registering
    const submitButton = signupForm.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) {
        submitButton.disabled = true;
    }

    signupMessage.textContent = "Creating your account...";

    try {
        // Send registration request to Flask
        const response = await fetch(
            "http://127.0.0.1:5000/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.json();
        // Handle errors
        if (!response.ok) {
            throw new Error(
                result.error || "Registration failed."
            );
        }

        // Registration successful
        signupMessage.textContent =
            "Account created successfully! Redirecting to login...";

        signupForm.reset();

        // Redirect to login page
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    }

    catch (error) {
        console.error("Signup Error:", error);
        signupMessage.textContent = error.message;
    }

    finally {
        if (submitButton) {
            submitButton.disabled = false;
        }
    }

});
