// ===============================
// LIVE VAULT LOGIN
// ===============================

// Login Credentials
const VALID_USERNAME = "Jampana";
const VALID_PASSWORD = "1997";

// Already Logged In
if (localStorage.getItem("liveVaultLogin") === "true") {
    window.location.href = "dashboard.html";
}

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (
        username === VALID_USERNAME &&
        password === VALID_PASSWORD
    ) {

        // Save Login
        localStorage.setItem("liveVaultLogin", "true");

        // Optional
        localStorage.setItem("liveVaultUser", username);

        // Redirect
        window.location.href = "dashboard.html";

    } else {

        errorMessage.innerHTML =
            "<i class='fa-solid fa-circle-exclamation'></i> Invalid Username or Password";

        document.getElementById("password").value = "";

    }

});

// Press Enter Anywhere
document.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {
        loginForm.requestSubmit();
    }

});
