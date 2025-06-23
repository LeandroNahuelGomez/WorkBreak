import { apiClient } from './api.js';

const contenedor = document.getElementById('formulario');

function mostrarError(mensaje) {
  let errorDiv = document.getElementById('mensaje-error');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'mensaje-error';
    errorDiv.classList.add('alert', 'alert-danger', 'text-center');
    contenedor.prepend(errorDiv);
  }
  errorDiv.textContent = mensaje;
}

function limpiarError() {
  const errorDiv = document.getElementById('mensaje-error');
  if (errorDiv) errorDiv.textContent = '';
}

function mostrarFormulario() {
  limpiarError();
  const modo = localStorage.getItem('modo') || 'cliente';

  if (modo === 'cliente') {
    contenedor.innerHTML = `
      <h2 class="text-center mb-4">¡Bienvenido a WorkBreak!</h2>
      <input type="text" id="nombreInput" class="form-control mb-3" placeholder="Tu nombre" autocomplete="name" />
      <button id="btnCliente" class="btn btn-primary w-100 mb-2">Ingresar como Cliente</button>
      <button id="btnCambiarModo" class="btn btn-outline-secondary w-100">Ingresar como Administrador</button>
    `;
    document.getElementById('btnCliente').addEventListener('click', ingresarCliente);
    document.getElementById('btnCambiarModo').addEventListener('click', cambiarModo);
  } else {
    contenedor.innerHTML = `
      <h2 class="text-center mb-4">Login Administrador</h2>
      <input type="email" id="emailInput" class="form-control mb-3" placeholder="Correo electrónico" autocomplete="email" />
      <input type="password" id="passInput" class="form-control mb-3" placeholder="Contraseña" autocomplete="current-password" />
      <button id="btnAdmin" class="btn btn-dark w-100 mb-2">Ingresar</button>
      <button id="btnCambiarModo" class="btn btn-outline-secondary w-100">Volver a Cliente</button>
    `;
    document.getElementById('btnAdmin').addEventListener('click', loginAdmin);
    document.getElementById('btnCambiarModo').addEventListener('click', cambiarModo);
  }
}

function cambiarModo() {
  const modoActual = localStorage.getItem('modo') || 'cliente';
  const nuevoModo = modoActual === 'cliente' ? 'admin' : 'cliente';
  localStorage.setItem('modo', nuevoModo);
  mostrarFormulario();
}

function validarEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

async function ingresarCliente() {
  limpiarError();
  const nombre = document.getElementById('nombreInput').value.trim();

  if (!nombre) {
    mostrarError('Por favor, ingresá tu nombre.');
    return;
  }

  // Solo guardamos localmente porque el cliente no está en la base de datos
  localStorage.setItem('nombreCliente', nombre);
  localStorage.setItem('rol', 'cliente');
  localStorage.setItem('modo', 'cliente');

  window.location.href = 'index.html';
}

async function loginAdmin() {
  limpiarError();

  const email = document.getElementById('emailInput').value.trim();
  const pass = document.getElementById('passInput').value.trim();

  if (!email || !pass) {
    mostrarError('Por favor, completá ambos campos.');
    return;
  }

  if (!validarEmail(email)) {
    mostrarError('Por favor, ingresá un correo válido.');
    return;
  }

  try {
    // Llamada a backend para validar credenciales
    const respuesta = await apiClient.fetchAPI('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });

    localStorage.setItem('rol', 'admin');
    localStorage.setItem('nombreAdmin', respuesta.nombre || email);
    localStorage.setItem('modo', 'admin');

    alert('Login exitoso.');
    window.location.href = 'index.html';

  } catch (error) {
    mostrarError('Credenciales inválidas o error de servidor.');
    console.error('Error login admin:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarFormulario();

  const logo = document.getElementById('logoWorkBreak');
  if (logo) {
    logo.addEventListener('click', () => {
      if (localStorage.getItem('modo') === 'admin') {
        window.location.href = 'index.html';
      }
    });
  }

  const toggleBtn = document.getElementById('toggle-dark');
  if (toggleBtn) {
    if (localStorage.getItem('modoOscuro') === 'true') {
      document.body.classList.add('dark-mode');
      toggleBtn.textContent = '☀️ Modo claro';
    } else {
      toggleBtn.textContent = '🌙 Modo oscuro';
    }

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const modoOscuroActivo = document.body.classList.contains('dark-mode');
      toggleBtn.textContent = modoOscuroActivo ? '☀️ Modo claro' : '🌙 Modo oscuro';
      localStorage.setItem('modoOscuro', modoOscuroActivo);
    });
  }
});