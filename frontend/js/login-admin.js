
import { apiClient, API_BASE_URL } from './api.js';

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
    alert("Inicio de sesión exitoso\nNombre: " + nameInput.value + "\nApellido: " + lastNameInput.value + "\nEmail: " + emailInput.value);

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

        // Guarda el token en localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', 'admin');

        // ✅ Redirige al dashboard admin
        window.location.href = "../../frontend/pages/dashboard-admin.html";

    } catch (error) {
        console.error('Error en el login:', error);
        alert(error.message || 'Error en el inicio de sesión');
    }
});

validateForm();