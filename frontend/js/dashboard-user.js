// let espaciosCargados = [];
// let tipoSeleccionado = "todos";

// function crearCard(espacio, badgeText = "Favorito entre usuarios") {
//     const imagen = espacio.imagen || 'https://via.placeholder.com/400x200?text=Sin+imagen';

//     const div = document.createElement("div");
//     div.className = "property-card";
//     div.innerHTML = `
//     <div class="property-image" style="background-image: url('${imagen}');"></div>
//     <div class="property-info">
//       <span class="favorite-badge">${badgeText}</span>
//       <h3 class="property-title">${espacio.titulo}</h3>
//       <p class="property-location">${espacio.descripcion}</p>
//       <p class="property-price">$${espacio.precio_hora} USD por día</p>
//       <div class="property-rating">
//         <span class="rating-star">★</span>
//         <span>${espacio.calificacion || '5.0'}</span>
//       </div>
//       <button class="btn-reservar">Reservar</button>
//     </div>
//   `;

//     // Agregar funcionalidad al botón
//     const boton = div.querySelector(".btn-reservar");
//     boton.addEventListener("click", () => {
//         // Redireccionar a detalle.html con el ID del producto como query param
//         window.location.href = `detalle.html?id=${espacio.producto_id}`;
//     });

//     return div;
// }

// // Función para renderizar los espacios (completa o filtrada)
// function renderizarEspacios(lista) {
//     const contenedorPopulares = document.getElementById("espacios-populares");
//     const contenedorNuevos = document.getElementById("espacios-nuevos");

//     contenedorPopulares.innerHTML = "";
//     contenedorNuevos.innerHTML = "";

//     lista.forEach(espacio => {
//         const badge = espacio.tipo === "nuevo" ? "Nuevo destino" : "Favorito entre usuarios";
//         const card = crearCard(espacio, badge);

//         if (espacio.tipo === "nuevo") {
//             contenedorNuevos.appendChild(card);
//         } else {
//             contenedorPopulares.appendChild(card);
//         }
//     });
// }

// // Función principal que carga desde la API
// async function cargarEspacios() {
//     try {
//         const data = await apiClient.fetchAPI('productos', { method: "GET" });

//         console.log("Datos obtenidos:", data);
//         // 🔍 Filtrar productos activos
//         const activos = data.filter(p => p.activo); // o p.activo, según tu backend

//         console.log("Productos activos:", activos);

//         espaciosCargados = activos;
//         console.log("Espacios cargados:", espaciosCargados);
//         renderizarEspacios(espaciosCargados);
//     } catch (error) {
//         console.error("No se pudieron cargar los espacios:", error);
//     }
// }

// // Evento al cargar el DOM
// document.addEventListener("DOMContentLoaded", () => {
//     cargarEspacios();

//     const abrirModalBtn = document.getElementById("abrir-filtros");
//     const cerrarModalBtn = document.getElementById("cerrar-filtros");
//     const modal = document.getElementById("modal-filtros");
//     const aplicarBtn = document.getElementById("aplicar-filtros");
//     const tipoBtns = document.querySelectorAll(".filter-type-btn");

//     abrirModalBtn.addEventListener("click", () => modal.classList.add("active"));
//     cerrarModalBtn.addEventListener("click", () => modal.classList.remove("active"));

//     tipoBtns.forEach(btn => {
//         btn.addEventListener("click", () => {
//             tipoBtns.forEach(b => b.classList.remove("active"));
//             btn.classList.add("active");
//             tipoSeleccionado = btn.dataset.tipo;
//         });
//     });

//     aplicarBtn.addEventListener("click", () => {
//         modal.classList.remove("active");

//         if (tipoSeleccionado === "todos") {
//             renderizarEspacios(espaciosCargados);
//         } else {
//             const tipoMap = {
//                 "espacio-trabajo": 1,
//                 "espacio-relax": 2,
//                 "espacio-creativo": 3
//             };

//             const filtrados = espaciosCargados.filter(e => e.tipo_producto_id === tipoMap[tipoSeleccionado]);

//             renderizarEspacios(filtrados);
//         }
//     });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
//   const badge = document.getElementById("badge-reservas");
//   badge.textContent = reservas.length;
// });


let espaciosCargados = [];
let tipoSeleccionado = "todos";

// Función para alternar el modo oscuro
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  
  // Guardar preferencia en localStorage
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  // Cambiar el ícono del botón
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  darkModeToggle.innerHTML = isDarkMode ? 'Modo claro' : 'Modo oscuro';
}

// Aplicar modo oscuro al cargar si estaba activado
function applySavedTheme() {
  const savedMode = localStorage.getItem('darkMode') === 'true';
  if (savedMode) {
    document.body.classList.add('dark-mode');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.innerHTML = 'Modo claro';
  }
}

function crearCard(espacio, badgeText = "Favorito entre usuarios") {
    const imagen = espacio.imagen || 'https://via.placeholder.com/400x200?text=Sin+imagen';

    const div = document.createElement("div");
    div.className = "property-card";
    div.innerHTML = `
    <div class="property-image" style="background-image: url('${imagen}');"></div>
    <div class="property-info">
      <span class="favorite-badge">${badgeText}</span>
      <h3 class="property-title">${espacio.titulo}</h3>
      <p class="property-location">${espacio.descripcion}</p>
      <p class="property-price">$${espacio.precio_hora} USD por día</p>
      <div class="property-rating">
        <span class="rating-star">★</span>
        <span>${espacio.calificacion || '5.0'}</span>
      </div>
      <button class="btn-reservar">Reservar</button>
    </div>
  `;

    const boton = div.querySelector(".btn-reservar");
    boton.addEventListener("click", () => {
        window.location.href = `detalle.html?id=${espacio.producto_id}`;
    });

    return div;
}

function renderizarEspacios(lista) {
    const contenedorPopulares = document.getElementById("espacios-populares");
    const contenedorNuevos = document.getElementById("espacios-nuevos");

    contenedorPopulares.innerHTML = "";
    contenedorNuevos.innerHTML = "";

    lista.forEach(espacio => {
        const badge = espacio.tipo === "nuevo" ? "Nuevo destino" : "Favorito entre usuarios";
        const card = crearCard(espacio, badge);

        if (espacio.tipo === "nuevo") {
            contenedorNuevos.appendChild(card);
        } else {
            contenedorPopulares.appendChild(card);
        }
    });
}

async function cargarEspacios() {
    try {
        const data = await apiClient.fetchAPI('productos', { method: "GET" });

        console.log("Datos obtenidos:", data);
        const activos = data.filter(p => p.activo);

        console.log("Productos activos:", activos);

        espaciosCargados = activos;
        console.log("Espacios cargados:", espaciosCargados);
        renderizarEspacios(espaciosCargados);
    } catch (error) {
        console.error("No se pudieron cargar los espacios:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Aplicar tema guardado
    applySavedTheme();
    
    // Configurar el botón de modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    cargarEspacios();

    const abrirModalBtn = document.getElementById("abrir-filtros");
    const cerrarModalBtn = document.getElementById("cerrar-filtros");
    const modal = document.getElementById("modal-filtros");
    const aplicarBtn = document.getElementById("aplicar-filtros");
    const tipoBtns = document.querySelectorAll(".filter-type-btn");

    abrirModalBtn.addEventListener("click", () => modal.classList.add("active"));
    cerrarModalBtn.addEventListener("click", () => modal.classList.remove("active"));

    tipoBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tipoBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            tipoSeleccionado = btn.dataset.tipo;
        });
    });

    aplicarBtn.addEventListener("click", () => {
        modal.classList.remove("active");

        if (tipoSeleccionado === "todos") {
            renderizarEspacios(espaciosCargados);
        } else {
            const tipoMap = {
                "espacio-trabajo": 1,
                "espacio-relax": 2,
                "espacio-creativo": 3
            };

            const filtrados = espaciosCargados.filter(e => e.tipo_producto_id === tipoMap[tipoSeleccionado]);

            renderizarEspacios(filtrados);
        }
    });
    
    // Badge de reservas
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const badge = document.getElementById("badge-reservas");
    if (badge) {
        badge.textContent = reservas.length;
    }
});