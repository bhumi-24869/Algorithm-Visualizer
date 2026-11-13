const loginForm = document.getElementById("login-form");

const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    loginMessage.textContent =
        "Login form is working! Backend authentication is not connected yet.";

});