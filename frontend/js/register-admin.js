
const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const phoneInput = document.getElementById("phone");
const registerBtn = document.getElementById("registerBtn");

function validateRegisterForm() {
    const name = nameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const phone = phoneInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    registerBtn.disabled = !(name && lastName && emailRegex.test(email) && password.length >= 6 && phone);
}

[nameInput, lastNameInput, emailInput, passwordInput, phoneInput].forEach(input => {
    input.addEventListener("input", validateRegisterForm);
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const phone = phoneInput.value.trim();

    try {
        const response = await apiClient.fetchAPI('auth/register', {
            method: "POST",
            body: JSON.stringify({
                nombre: name,
                apellido: lastName,
                email: email,
                contraseña: password,
                telefono: phone
            })
        });
        // Limpiar los campos del formulario
        nameInput.value = '';
        lastNameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        phoneInput.value = '';
        registerBtn.disabled = true;
        // Redireccionar al dashboard de usuario
        window.location.href = 'login-admin.html';
    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('409')) {
            alert('El correo electrónico ya está registrado.');
        } else {
            alert('Error al registrar usuario.');
        }
    }
});
