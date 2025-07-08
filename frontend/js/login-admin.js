//Traemos los inputs
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

//Doble validacion de formulario
function validateForm() {
    const name = nameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    loginBtn.disabled = !(name && lastName && emailRegex.test(email) && password.length >= 6);
}

// Event listeners para validación en tiempo real
[nameInput, lastNameInput, emailInput, passwordInput].forEach(input => {
    input.addEventListener("input", validateForm);
});

// Single submit handler
document.getElementById('adminForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
        const response = await apiClient.fetchAPI('auth/login-admin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: name,
                apellido: lastName,
                email: email,
                password: password,
            })
        });

        // Guarda el token en localStorage (debe ser 'token' para que el dashboard lo lea)
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', 'admin');

        // ✅ Redirige al dashboard admin
        window.location.href = "../../frontend/pages/dashboard-admin.html";

    } catch (error) {
        console.error('Error en el login:', error);
        alert(error.message || 'Error en el inicio de sesión');
    }
});

const secretBtn = document.getElementById("adminSecretBtn");

secretBtn.addEventListener("click", () => {
    window.location.href = "login-user.html";
});
// Detectar doble clic en el logo
const logo = document.querySelector("img"); // O usá un id si lo tenés: document.getElementById("logo")
logo.addEventListener("dblclick", () => {
    // Obtener los campos del formulario
    const nombre = document.getElementById("name");
    const apellido = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");

    // Verificamos que todos existan
    if (nombre && apellido && email && password && loginBtn) {
        // Asignamos valores de prueba
        nombre.value = "Leandro";
        apellido.value = "Gomez";
        email.value = "leandro@gmail.com";
        password.value = "Leandro123_";

        // Habilitamos el botón si estaba deshabilitado
        loginBtn.disabled = false;
    } else {
        console.warn("❌ Uno o más campos del formulario no se encontraron");
    }
});

let clickCount = 0;
let clickTimer;

const titulo = document.getElementById("tituloWorkBreak");

titulo.addEventListener("click", () => {
    clickCount++;

    clearTimeout(clickTimer); // reinicia el contador si clickean rápido

    if (clickCount === 4) {
        // Redirigir a la pantalla de registro
        window.location.href = "register-admin.html";
    } else {
        // Si no llegaron a 4, resetea después de 1.5 segundos
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 1500);
    }
});



validateForm();