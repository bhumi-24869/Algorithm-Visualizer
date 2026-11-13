const signupForm = document.getElementById("signup-form");

const signupMessage = document.getElementById("signup-message");

signupForm.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get password values
    const password = document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirm-password").value;

    // Check whether passwords match
    if (password !== confirmPassword) {

        signupMessage.textContent = "Passwords do not match!";

        return;
    }

    // Display success message
    signupMessage.textContent =
        "Your form is ready! Backend registration is not connected yet.";

});