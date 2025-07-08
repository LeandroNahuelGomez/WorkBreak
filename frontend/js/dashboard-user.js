let espaciosCargados = [];
let tipoSeleccionado = "todos";
let paginaActual = 1;
const productosPorPagina = 6;
let espaciosFiltrados = []; // para filtros y búsquedas

function mostrarPagina(pagina) {
    const contenedor = document.getElementById("espacios-populares");
    contenedor.innerHTML = "";

    const total = espaciosFiltrados.length;
    if (total === 0) {
        contenedor.innerHTML = `<div class="no-resultados"><p>No se encontraron resultados para tu búsqueda.</p></div>`;
        return;
    }

    const inicio = (pagina - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const paginaActualEspacios = espaciosFiltrados.slice(inicio, fin);

    paginaActualEspacios.forEach(espacio => {
        const badge = "Nuevo destino";
        const card = crearCard(espacio, badge);
        contenedor.appendChild(card);
    });

    renderizarPaginacion();
}

function renderizarPaginacion() {
    const totalPaginas = Math.ceil(espaciosFiltrados.length / productosPorPagina);

    // Buscar o crear contenedor de paginación separado
    let contenedorPaginacion = document.getElementById("contenedor-paginacion");
    if (!contenedorPaginacion) {
        contenedorPaginacion = document.createElement("div");
        contenedorPaginacion.id = "contenedor-paginacion";
        contenedorPaginacion.style.cssText = `
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 30px;
            padding: 20px 0;
        `;

        // Insertar después del contenedor de espacios
        const contenedorEspacios = document.getElementById("espacios-populares");
        contenedorEspacios.parentNode.insertBefore(contenedorPaginacion, contenedorEspacios.nextSibling);
    }

    // Limpiar contenedor de paginación
    contenedorPaginacion.innerHTML = "";

    // Solo mostrar paginación si hay más de una página
    if (totalPaginas <= 1) return;

    const paginacionDiv = document.createElement("div");
    paginacionDiv.classList.add("paginacion");
    paginacionDiv.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
    `;

    // Botón anterior
    if (paginaActual > 1) {
        const btnAnterior = document.createElement("button");
        btnAnterior.textContent = "← Anterior";
        btnAnterior.classList.add("btn-paginacion");
        btnAnterior.style.cssText = `
            padding: 0.8rem 1.5rem;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        btnAnterior.onclick = () => {
            paginaActual--;
            mostrarPagina(paginaActual);
        };
        btnAnterior.onmouseover = () => {
            btnAnterior.style.transform = "translateY(-2px)";
            btnAnterior.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        };
        btnAnterior.onmouseout = () => {
            btnAnterior.style.transform = "translateY(0)";
            btnAnterior.style.boxShadow = "none";
        };
        paginacionDiv.appendChild(btnAnterior);
    }

    // Números de página
    const maxPaginasVisibles = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginasVisibles - 1);

    if (fin - inicio < maxPaginasVisibles - 1) {
        inicio = Math.max(1, fin - maxPaginasVisibles + 1);
    }

    for (let i = inicio; i <= fin; i++) {
        const btnPagina = document.createElement("button");
        btnPagina.textContent = i;
        btnPagina.classList.add("btn-paginacion");

        const esActual = i === paginaActual;
        btnPagina.style.cssText = `
            padding: 0.8rem 1rem;
            background: ${esActual ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'white'};
            color: ${esActual ? 'white' : 'var(--text-dark)'};
            border: ${esActual ? 'none' : '1px solid var(--gray-border)'};
            border-radius: 8px;
            cursor: pointer;
            font-weight: ${esActual ? '600' : '500'};
            font-size: 14px;
            min-width: 45px;
            transition: all 0.3s ease;
            box-shadow: ${esActual ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'};
        `;

        if (esActual) {
            btnPagina.classList.add("active");
        }

        btnPagina.onclick = () => {
            paginaActual = i;
            mostrarPagina(paginaActual);
        };

        if (!esActual) {
            btnPagina.onmouseover = () => {
                btnPagina.style.background = "linear-gradient(135deg, var(--primary-color), var(--primary-light))";
                btnPagina.style.color = "white";
                btnPagina.style.transform = "translateY(-2px)";
                btnPagina.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            };
            btnPagina.onmouseout = () => {
                btnPagina.style.background = "white";
                btnPagina.style.color = "var(--text-dark)";
                btnPagina.style.transform = "translateY(0)";
                btnPagina.style.boxShadow = "none";
            };
        }

        paginacionDiv.appendChild(btnPagina);
    }

    // Botón siguiente
    if (paginaActual < totalPaginas) {
        const btnSiguiente = document.createElement("button");
        btnSiguiente.textContent = "Siguiente →";
        btnSiguiente.classList.add("btn-paginacion");
        btnSiguiente.style.cssText = `
            padding: 0.8rem 1.5rem;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        btnSiguiente.onclick = () => {
            paginaActual++;
            mostrarPagina(paginaActual);
        };
        btnSiguiente.onmouseover = () => {
            btnSiguiente.style.transform = "translateY(-2px)";
            btnSiguiente.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        };
        btnSiguiente.onmouseout = () => {
            btnSiguiente.style.transform = "translateY(0)";
            btnSiguiente.style.boxShadow = "none";
        };
        paginacionDiv.appendChild(btnSiguiente);
    }

    contenedorPaginacion.appendChild(paginacionDiv);
}

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
    const imagen = "../../backend/db/image/1696536427-coworking-spaces-hybrid-world-1023-g1437209221.jpg";

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

// Función unificada para aplicar filtros y mostrar resultados con paginación
function aplicarFiltrosYMostrar(espacios) {
    espaciosFiltrados = espacios;
    paginaActual = 1; // Resetear a la primera página
    mostrarPagina(paginaActual);
}

// Función para renderizar espacios (mantener compatibilidad pero usar paginación)
function renderizarEspacios(lista) {
    aplicarFiltrosYMostrar(lista);
}

async function cargarEspacios() {
    try {
        const data = await apiClient.fetchAPI('productos', { method: "GET" });

        console.log("Datos obtenidos:", data);
        const activos = data.filter(p => p.activo);

        console.log("Productos activos:", activos);

        espaciosCargados = activos;
        console.log("Espacios cargados:", espaciosCargados);

        // Usar la función unificada
        aplicarFiltrosYMostrar(espaciosCargados);
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
            aplicarFiltrosYMostrar(espaciosCargados);
        } else {
            const tipoMap = {
                "espacio-trabajo": 1,
                "espacio-relax": 2,
                "espacio-creativo": 3
            };

            const filtrados = espaciosCargados.filter(e => e.tipo_producto_id === tipoMap[tipoSeleccionado]);
            aplicarFiltrosYMostrar(filtrados);
        }
    });

    // Badge de reservas
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const badge = document.getElementById("badge-reservas");
    if (badge) {
        badge.textContent = reservas.length;
    }

    // Barra de búsqueda
    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-btn");

    searchBtn.addEventListener("click", () => {
        const termino = searchInput.value.trim().toLowerCase();

        if (termino === "") {
            aplicarFiltrosYMostrar(espaciosCargados);
            return;
        }

        const resultados = espaciosCargados.filter(espacio => {
            const titulo = (espacio.titulo || "").toLowerCase();
            const descripcion = (espacio.descripcion || "").toLowerCase();
            return titulo.includes(termino) || descripcion.includes(termino);
        });

        aplicarFiltrosYMostrar(resultados);
    });

    // También buscar al presionar Enter
    searchInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });

    const logoutBtn = document.getElementById("logout-btn");

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("nombreUsuario"); // o lo que uses para autenticar
        window.location.href = "login-user.html"; // o login.html si corresponde
    });
});

