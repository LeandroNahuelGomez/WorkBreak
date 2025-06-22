// ================================
  // Variables y elementos DOM
  // ================================
  let rol = localStorage.getItem("rol") || "cliente";

  const adminSection = document.getElementById("admin-section");
  const modalAgregar = document.getElementById("modalAgregar");
  const formAgregar = document.getElementById("formAgregarProducto");
  const btnCancelarAgregar = document.getElementById("btnCancelarAgregar");
  const modalTitulo = document.getElementById("modalTitulo");
  const workspacesGrid = document.getElementById("workspacesGrid");

  let productos = [];

  // ================================
  // Función para cargar productos desde API
  // ================================
  async function cargarProductos() {
    try {
      const res = await fetch("/api/v1/producto");
      if (!res.ok) throw new Error("Error al cargar productos");
      productos = await res.json();
      renderProductos(getFiltroActivo());
    } catch (error) {
      alert("No se pudieron cargar los productos");
      console.error(error);
    }
  }

  // ================================
  // Función para mostrar productos filtrados
  // ================================
  function renderProductos(filtro = "todos") {
    workspacesGrid.innerHTML = "";
    productos.forEach(p => {
      if (filtro === "todos" || p.categoria === filtro) {
        const div = document.createElement("div");
        div.className = "workspace-card";
        div.dataset.category = p.categoria;
        div.dataset.id = p.id;

        div.innerHTML = `
          <div class="workspace-image"></div>
          <div class="workspace-info">
            <h3 class="workspace-name">${p.nombre}</h3>
            <div class="workspace-location">📍 ${p.descripcion || ""}</div>
          </div>
          <div class="workspace-price">
            <div class="price-current">ARS ${parseFloat(p.precio).toFixed(2)}</div>
            ${rol === "admin" ? `
              <button class="btn btn-warning btn-sm btnEditar" data-id="${p.id}">Editar</button>
              <button class="btn btn-danger btn-sm btnEliminar" data-id="${p.id}">Eliminar</button>
            ` : `
              <button class="book-btn" data-id="${p.id}">Reservar</button>
            `}
            <button class="info-btn" data-id="${p.id}">Información</button>
          </div>
        `;
        workspacesGrid.appendChild(div);
      }
    });
    asignarEventos();
  }

  // ================================
  // Asignar eventos a botones generados
  // ================================
  function asignarEventos() {
    document.querySelectorAll(".info-btn").forEach(btn => {
      btn.onclick = () => {
        window.location.href = "detalle.html?id=" + btn.dataset.id;
      };
    });

    if (rol === "admin") {
      document.querySelectorAll(".btnEditar").forEach(btn => {
        btn.onclick = () => {
          const id = parseInt(btn.dataset.id);
          const prod = productos.find(p => p.id === id);
          if (!prod) return alert("Producto no encontrado");
          abrirModalEditar(prod);
        };
      });

      document.querySelectorAll(".btnEliminar").forEach(btn => {
        btn.onclick = async () => {
          const id = parseInt(btn.dataset.id);
          if (confirm("¿Querés eliminar este producto?")) {
            try {
              const res = await fetch(`/api/v1/producto/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("No se pudo eliminar el producto");
              productos = productos.filter(p => p.id !== id);
              renderProductos(getFiltroActivo());
            } catch (error) {
              alert("Error eliminando el producto");
              console.error(error);
            }
          }
        };
      });
    } else {
      document.querySelectorAll(".book-btn").forEach(btn => {
        btn.onclick = () => {
          const id = parseInt(btn.dataset.id);
          const producto = productos.find(p => p.id === id);
          if (!producto) return alert("Producto no encontrado");

          // Guardar producto en carrito en localStorage
          let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

          // Evitar duplicados (opcional)
          const existe = carrito.find(item => item.id === producto.id);
          if (existe) {
            alert("Este producto ya está en tu carrito");
            return;
          }

          carrito.push(producto);
          localStorage.setItem("carrito", JSON.stringify(carrito));
          alert(`"${producto.nombre}" agregado al carrito.`);
        };
      });
    }
  }

  // ================================
  // Mostrar u ocultar sección admin según rol
  // ================================
  function mostrarPanelSegunRol() {
    if (rol === "admin") {
      adminSection.style.display = "block";
    } else {
      adminSection.style.display = "none";
    }
    cargarProductos();
  }

  // ================================
  // Botón agregar producto abre modal
  // ================================
  document.getElementById("btnAgregarProducto").onclick = () => {
    abrirModalAgregar();
  };

  // ================================
  // Abrir modal para agregar producto
  // ================================
  function abrirModalAgregar() {
    modalTitulo.textContent = "Agregar producto";
    formAgregar.reset();
    document.getElementById("productoId").value = "";
    modalAgregar.style.display = "flex";
  }

  // ================================
  // Abrir modal para editar producto
  // ================================
  function abrirModalEditar(prod) {
    modalTitulo.textContent = "Editar producto";
    document.getElementById("productoId").value = prod.id;
    document.getElementById("nombreProd").value = prod.nombre;
    document.getElementById("descripcionProd").value = prod.descripcion || "";
    document.getElementById("precioProd").value = prod.precio;
    document.getElementById("categoriaProd").value = prod.categoria;
    modalAgregar.style.display = "flex";
  }

  // ================================
  // Cancelar agregar/editar cierra modal
  // ================================
  btnCancelarAgregar.onclick = () => {
    modalAgregar.style.display = "none";
  };

  // ================================
  // Enviar formulario agregar/editar producto
  // ================================
  formAgregar.onsubmit = async (e) => {
    e.preventDefault();

    const id = document.getElementById("productoId").value;
    const nombre = document.getElementById("nombreProd").value.trim();
    const descripcion = document.getElementById("descripcionProd").value.trim();
    const precio = parseFloat(document.getElementById("precioProd").value);
    const categoria = document.getElementById("categoriaProd").value;

    if (!nombre || !descripcion || isNaN(precio) || !categoria) {
      alert("Complete todos los campos correctamente.");
      return;
    }

    const productoData = { nombre, descripcion, precio, categoria };

    try {
      let res;
      if (id) {
        // Editar producto
        res = await fetch(`/api/v1/producto/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoData)
        });
      } else {
        // Crear producto
        res = await fetch("/api/v1/producto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoData)
        });
      }

      if (!res.ok) {
        const errorRes = await res.json();
        throw new Error(errorRes.error || "Error en la operación");
      }

      modalAgregar.style.display = "none";
      await cargarProductos();

    } catch (error) {
      alert("Error guardando el producto: " + error.message);
      console.error(error);
    }
  };

  // ================================
  // Obtener filtro activo (para render)
  // ================================
  function getFiltroActivo() {
    const filtro = document.querySelector(".filter-item.active");
    return filtro ? filtro.dataset.filter : "todos";
  }

  // ================================
  // Evento para cambiar filtro y renderizar
  // ================================
  document.querySelectorAll(".filter-item").forEach(filtro => {
    filtro.onclick = () => {
      document.querySelectorAll(".filter-item").forEach(f => f.classList.remove("active"));
      filtro.classList.add("active");
      renderProductos(filtro.dataset.filter);
    };
  });

  // ================================
  // Mostrar panel según rol y cargar productos
  // ================================
  mostrarPanelSegunRol();

  // ================================
  // Modo oscuro
  // ================================
  document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggle-dark");
    if (!toggleBtn) return;

    // Carga estado guardado en localStorage (si hay)
    if (localStorage.getItem("modoOscuro") === "true") {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️ Modo claro";
    } else {
      toggleBtn.textContent = "🌙 Modo oscuro";
    }

    // Evento para alternar modo oscuro y guardar estado
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const modoActual = document.body.classList.contains("dark-mode");
      toggleBtn.textContent = modoActual ? "☀️ Modo claro" : "🌙 Modo oscuro";
      localStorage.setItem("modoOscuro", modoActual);
    });
  });


