const API_URL = "https://people-api-1ywv.onrender.com";

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            `${API_URL}/api/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        console.log("Register response:", JSON.stringify(data, null, 2));

        if (response.ok) {
            message.textContent = data.message || "Registration successful!";
        } else {
            message.textContent = data.message || "Registration failed.";
        }

    } catch (error) {

        console.error("Registration error:", error);

        message.textContent =
            "Unable to connect to the backend.";
    }

});
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("message");

        try {

            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log(
                "Login response:",
                JSON.stringify(data, null, 2)
            );

            if (response.ok) {

                message.textContent =
                    data.message || "Login successful!";

                // Save JWT token
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    console.log("JWT token saved.");
                }

            } else {

                message.textContent =
                    data.message || "Login failed.";

            }

        } catch (error) {

            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to the backend.";
        }

    });

}