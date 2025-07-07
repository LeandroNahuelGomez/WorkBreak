const nameInput = document.getElementById("userName");
const continueBtn = document.getElementById("continueBtn");

nameInput.addEventListener("input", () => {
    continueBtn.disabled = !nameInput.value.trim();
});


document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = nameInput.value.trim();

    // Guardar el nombre en localStorage
    localStorage.setItem("nombreUsuario", nombre);

    // Redirigir a la vista dashboard-user
    window.location.href = "../../frontend/pages/dashboard-user.html";
});

let secretClickCount = 0;
let secretTimer;

const secretBtn = document.getElementById("adminSecretBtn");

secretBtn.addEventListener("click", () => {
    secretClickCount++;

    clearTimeout(secretTimer);

    if (secretClickCount === 2) {
        window.location.href = "login-admin.html";
    } else {
        secretTimer = setTimeout(() => {
            secretClickCount = 0;
        }, 1500);
    }
});
