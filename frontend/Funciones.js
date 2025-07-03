document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // VARIABLES Y ELEMENTOS DEL DOM
  // ================================
  const workspacesGrid = document.querySelector("#workspacesGrid");
  const formAgregarProducto = document.querySelector("#formAgregarProducto");
  const modalAgregar = document.querySelector("#modalAgregar");
  const modalTitulo = document.querySelector("#modalTitulo");
  const adminSection = document.querySelector("#admin-section");
  const btnCancelarAgregar = document.querySelector("#btnCancelarAgregar");
  const botonModoOscuro = document.querySelector("#toggle-dark");
  const btnAgregarProducto = document.querySelector("#btnAgregarProducto");

  let productos = [];
  let rol = localStorage.getItem("rol") || "cliente";

  // ================================
  // MODO OSCURO
  // ================================
  if (botonModoOscuro) {
    if (localStorage.getItem("modoOscuro") === "true") {
      document.body.classList.add("dark-mode");
    }
    botonModoOscuro.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("modoOscuro", document.body.classList.contains("dark-mode"));
    });
  }

  // ================================
  // CARGAR PRODUCTOS DESDE LA API
  // ================================
  const cargarProductos = async () => {
    try {
      // Prueba diferentes endpoints hasta encontrar el correcto:
      // Opción 1: "productos" (plural)
      // Opción 2: "producto" (singular) 
      // Opción 3: "" (raíz)
      const res = await apiClient.fetchAPI("productos", { // Cambiado a plural
        method: "GET"
      });
      productos = res.data || res; // Ajustar según la estructura de respuesta de tu API
      renderizarProductos(getFiltroActivo(), productos);
    } catch (error) {
      console.error("Error al cargar productos", error);
      console.error("Endpoint probado: productos");
      alert("No se pudieron cargar los productos. Verifica el endpoint en la consola.");
    }
  };

  // ================================
  // MOSTRAR PRODUCTOS EN LA VISTA
  // ================================
  const renderizarProductos = (filtro = "todos", productos) => {
    workspacesGrid.innerHTML = "";

    productos.forEach((p) => {
      if (filtro === "todos" || p.categoria === filtro) {
        const div = document.createElement("div");
        div.className = "workspace-card";
        div.dataset.category = p.categoria;
        div.dataset.id = p.id;

        div.innerHTML = `
          <div class="workspace-image"></div>
          <div class="workspace-info">
            <h3 class="workspace-name">${p.titulo}</h3>
            <div class="workspace-location">📍 ${p.descripcion || ""}</div>
          </div>
          <div class="workspace-price">
            <div class="price-current">ARS ${parseFloat(p.precioxdia).toFixed(2)}</div>
            ${rol === "admin"
              ? `
                <button class="btn btn-warning btn-sm btnEditar" data-id="${p.id}">Editar</button>
                <button class="btn btn-danger btn-sm btnEliminar" data-id="${p.id}">Eliminar</button>
              `
              : `
                <button class="book-btn" data-id="${p.id}">Reservar</button>
              `}
            <button class="info-btn" data-id="${p.id}">Información</button>
          </div>
        `;

        workspacesGrid.appendChild(div);
      }
    });

    asignarEventos();
  };

  // ================================
  // ASIGNAR EVENTOS A BOTONES
  // ================================
  const asignarEventos = () => {
    // Botón Información
    document.querySelectorAll(".info-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = `detalle.html`;
      });
    });

    if (rol === "admin") {
      // Botón Editar
      document.querySelectorAll(".btnEditar").forEach((btn) => {
        btn.addEventListener("click", () => {
          const producto = productos.find((p) => p.id == btn.dataset.id);
          abrirModalEditar(producto);
        });
      });

      // Botón Eliminar
      document.querySelectorAll(".btnEliminar").forEach((btn) => {
        btn.addEventListener("click", () => eliminarProducto(btn.dataset.id));
      });
    } else {
      // Botón Reservar (agregar al carrito)
      document.querySelectorAll(".book-btn").forEach((btn) => {
        btn.addEventListener("click", () => agregarAlCarrito(btn.dataset.id));
      });
    }
  };

  // ================================
  // FUNCIONES PARA CLIENTES
  // ================================
  const agregarAlCarrito = (id) => {
    const producto = productos.find((p) => p.id == id);
    if (!producto) return alert("Producto no encontrado");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.find((item) => item.id == id)) {
      alert("Este producto ya está en tu carrito");
      return;
    }

    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`"${producto.nombre}" agregado al carrito`);
  };

  // ================================
  // FUNCIONES PARA ADMINISTRADORES
  // ================================
  const eliminarProducto = async (id) => {
    try {
      // Cambiado a plural para coincidir
      await apiClient.fetchAPI(`productos/${id}`, {
        method: "DELETE"
      });
      await cargarProductos();
    } catch (error) {
      console.error("Error al eliminar el producto", error);
      console.error("Endpoint probado: productos/" + id);
      alert("No se pudo eliminar el producto");
    }
  };

  const abrirModalAgregar = () => {
    modalTitulo.textContent = "Agregar producto";
    formAgregarProducto.reset();
    document.querySelector("#productoId").value = "";
    modalAgregar.style.display = "flex";
  };

  const abrirModalEditar = (prod) => {
    modalTitulo.textContent = "Editar producto";
    document.querySelector("#productoId").value = prod.id;
    document.querySelector("#nombreProd").value = prod.nombre;
    document.querySelector("#descripcionProd").value = prod.descripcion;
    document.querySelector("#precioProd").value = prod.precio;
    document.querySelector("#categoriaProd").value = prod.categoria;
    modalAgregar.style.display = "flex";
  };

  formAgregarProducto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.querySelector("#productoId").value;
    const productoData = {
      nombre: document.querySelector("#nombreProd").value.trim(),
      descripcion: document.querySelector("#descripcionProd").value.trim(),
      precio: parseFloat(document.querySelector("#precioProd").value),
      categoria: document.querySelector("#categoriaProd").value,
    };

    if (!productoData.nombre || !productoData.descripcion || isNaN(productoData.precio) || !productoData.categoria) {
      alert("Complete todos los campos correctamente.");
      return;
    }

    try {
      if (id) {
        // EDITAR - usando plural
        await apiClient.fetchAPI(`productos/${id}`, {
          method: "PUT",
          body: JSON.stringify(productoData)
        });
      } else {
        // CREAR - usando plural
        await apiClient.fetchAPI("productos", {
          method: "POST",
          body: JSON.stringify(productoData)
        });
      }

      modalAgregar.style.display = "none";
      await cargarProductos();
    } catch (error) {
      console.error("Error guardando producto", error);
      console.error("Endpoint probado:", id ? `productos/${id}` : "productos");
      alert("No se pudo guardar el producto");
    }
  });

  // ================================
  // UTILIDADES
  // ================================
  btnCancelarAgregar.addEventListener("click", () => {
    modalAgregar.style.display = "none";
  });

  if (btnAgregarProducto) {
    btnAgregarProducto.addEventListener("click", abrirModalAgregar);
  }

  const getFiltroActivo = () => {
    const filtro = document.querySelector(".filter-item.active");
    return filtro ? filtro.dataset.filter : "todos";
  };

  document.querySelectorAll(".filter-item").forEach((filtro) => {
    filtro.addEventListener("click", () => {
      document.querySelectorAll(".filter-item").forEach((f) => f.classList.remove("active"));
      filtro.classList.add("active");
      renderizarProductos(filtro.dataset.filter, productos);
    });
  });

  const mostrarPanelAdmin = () => {
    if (adminSection) {
      adminSection.style.display = rol === "admin" ? "block" : "none";
    }
  };

  // ================================
  // INICIALIZACIÓN
  // ================================
  mostrarPanelAdmin();
  cargarProductos();
});