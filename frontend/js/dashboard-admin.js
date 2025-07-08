// Cargar productos desde la API
async function cargarProductos(tipoFiltro = null) {
    const tabla = document.getElementById("tablaProductos");
    const tbody = tabla.querySelector("tbody");

    try {
        // Mostrar spinner de carga
        tbody.innerHTML = "<tr><td colspan='10' class='text-center'><div class='spinner-border' role='status'><span class='visually-hidden'>Cargando...</span></div></td></tr>";

        // Obtener token del localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login-admin.html";
            return;
        }

        // Obtener TODOS los productos
        const res = await apiClient.fetchAPI("productos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API productos:", res);

        // Manejar diferentes formatos de respuesta
        let productos = [];
        if (Array.isArray(res)) {
            productos = res;
        } else if (res && res.productos) {
            productos = res.productos;
        } else if (res && res.data) {
            productos = res.data; // Para APIs que usan formato {data: [...]}
        }

        // Aplicar filtro localmente si se especificó un tipo
        if (tipoFiltro && !isNaN(tipoFiltro)) {
            productos = productos.filter(p => p.tipo_producto_id == tipoFiltro);
        }

        // Limpiar tabla para mostrar resultados
        tbody.innerHTML = "";

        if (productos.length === 0) {
            const mensaje = tipoFiltro 
                ? `No se encontraron productos del tipo ${tipoFiltro}` 
                : "No se encontraron productos.";
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center py-4 text-muted">
                        ${mensaje}
                    </td>
                </tr>
            `;
            return;
        }

        // Mostrar los productos en la tabla
        productos.forEach(p => {
            const fila = document.createElement("tr");
            const estadoTexto = p.activo ? "Activo" : "Inactivo";
            const estadoClase = p.activo ? "text-success" : "text-danger";

            fila.innerHTML = `
                <td>${p.producto_id}</td>
                <td>${p.tipo_producto_id}</td>
                <td>${p.titulo}</td>
                <td>${p.descripcion}</td>
                <td>${p.capacidad}</td>
                <td>${p.normas}</td>
                <td><span class="${estadoClase}">${estadoTexto}</span></td>
                <td>${p.fecha_creacion}</td>
                <td>$${p.precio_hora}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar-producto" data-id="${p.producto_id}">Editar</button>
                    ${p.activo ?
                    `<button class="btn btn-sm btn-warning btn-desactivar-producto ms-1" data-id="${p.producto_id}" data-titulo="${p.titulo}">Desactivar</button>` :
                    `<button class="btn btn-sm btn-success btn-activar-producto ms-1" data-id="${p.producto_id}" data-titulo="${p.titulo}">Activar</button>`
                }
                </td>
            `;
            tbody.appendChild(fila);
        });

        tabla.classList.remove("d-none");
        document.querySelector("#divListadoProductos .spinner-border")?.remove();

    } catch (error) {
        console.error("Error al cargar productos:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-4 text-danger">
                    Error al cargar productos: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Clase EditFormManager mejorada
class EditFormManager {
    constructor() {
        this.configs = new Map();
        this.currentEditingId = null;
        this.initializeEventListeners();
    }

    registerEditForm(config) {
        const {
            formId,
            cardId,
            cancelButtonId,
            editButtonClass,
            apiEndpoint,
            fieldsMapping,
            onSuccess,
            onError,
            reloadFunction,
            isCreate = false // Nueva propiedad para diferenciar crear vs editar
        } = config;

        this.configs.set(formId, {
            cardId,
            cancelButtonId,
            editButtonClass,
            apiEndpoint,
            fieldsMapping,
            onSuccess: onSuccess || (() => { }),
            onError: onError || ((error) => console.error(error)),
            reloadFunction: reloadFunction || (() => { }),
            isCreate
        });

        this.setupFormListeners(formId);
        this.setupCancelButton(formId);
    }

    setupFormListeners(formId) {
        const form = document.getElementById(formId);
        const config = this.configs.get(formId);

        if (!form || !config) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await this.handleFormSubmit(formId, e);
        });
    }

    setupCancelButton(formId) {
        const config = this.configs.get(formId);
        if (!config) return;

        const cancelButton = document.getElementById(config.cancelButtonId);
        console.log("Buscando botón cancelar para:", formId, "→ encontrado:", cancelButton); // 🪵
        if (cancelButton) {
            cancelButton.addEventListener("click", () => {
                this.hideEditCard(config.cardId);
                this.currentEditingId = null;
                // Limpiar formulario si es de creación
                if (config.isCreate) {
                    const form = document.getElementById(formId);
                    if (form) form.reset();
                }
            });
        }
    }

    initializeEventListeners() {
        document.addEventListener("click", async (e) => {
            console.log("Click detectado en:", e.target.className); // Debug

            // Manejo de botones de editar/agregar
            for (const [formId, config] of this.configs) {
                if (e.target.classList.contains(config.editButtonClass)) {
                    console.log(`Botón encontrado para ${formId}, isCreate: ${config.isCreate}`); // Debug
                    if (config.isCreate) {
                        await this.handleCreateClick(formId);
                    } else {
                        await this.handleEditClick(formId, e.target);
                    }
                    break;
                }
            }

            // Manejo específico del botón "Agregar producto" por ID o texto
            if (e.target.matches("#btnAgregarProducto") ||
                e.target.closest("#btnAgregarProducto")) {
                console.log("Botón Agregar producto clickeado"); // Debug
                await this.handleCreateClick("formAgregarProducto");
            }

            // Manejo de botones de desactivar/activar
            if (e.target.classList.contains("btn-desactivar-producto")) {
                await this.handleToggleProducto(e.target, false);
            } else if (e.target.classList.contains("btn-activar-producto")) {
                await this.handleToggleProducto(e.target, true);
            }

            // Manejo de botón eliminar usuario
            if (e.target.classList.contains("btn-eliminar-usuario")) {
                console.log("Elemento clickeado:", e.target); // ✅ Ver el botón real
                const id = e.target.getAttribute("data-id");
                const nombre = e.target.getAttribute("data-nombre");
                console.log(`Enviando petición a: http://localhost:3000/api/v1/usuarios/${id} data-nombre=${nombre}`);

                if (confirm(`¿Estás seguro que querés eliminar al usuario "${nombre}"?`)) {
                    try {
                        const token = localStorage.getItem("token");
                        await apiClient.fetchAPI(`usuarios/${id}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        console.log("Usuario eliminado correctamente");
                        cargarEmpleados(); // Recargar tabla
                    } catch (error) {
                        console.error("Error al eliminar usuario:", error);
                        alert(`Error al eliminar usuario: ${error.message}`);
                    }
                }
            }


            // Manejo específico del botón "Agregar empleado" por ID o texto
            if (e.target.matches("#btnAgregarEmpleado") ||
                e.target.closest("#btnAgregarEmpleado")) {
                console.log("Botón Agregar empleado clickeado"); // Debug
                await this.handleCreateClick("formAgregarEmpleado");
            }

        });
    }

    // Nuevo método para manejar creación
    async handleCreateClick(formId) {
        console.log(`[handleCreateClick] Iniciando creación para ${formId}`); // Debug
        const config = this.configs.get(formId);
        if (!config) {
            console.error(`[handleCreateClick] No se encontró configuración para ${formId}`);
            return;
        }

        // Limpiar formulario
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            console.log(`[handleCreateClick] Formulario ${formId} limpiado`);
        }

        this.currentEditingId = null; // No hay ID para crear
        this.showEditCard(config.cardId);

        // Si es el formulario de productos, cargar tipos
        if (formId === "formAgregarProducto") {
            await cargarProductos(); // 👈 cargar opciones del select
        }
        console.log(`[handleCreateClick] Card ${config.cardId} mostrada`);
    }

    async handleEditClick(formId, button) {
        const config = this.configs.get(formId);
        if (!config) return;

        const id = button.getAttribute("data-id");
        this.currentEditingId = id;

        try {
            const token = localStorage.getItem("token");
            const data = await apiClient.fetchAPI(`${config.apiEndpoint}/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("[handleEditClick] Datos recibidos para edición:", data);

            this.populateForm(formId, data, config.fieldsMapping);
            this.showEditCard(config.cardId);


        } catch (error) {
            config.onError(`Error al cargar datos: ${error.message}`);
        }
    }

    // Nuevo método para manejar activar/desactivar productos
    async handleToggleProducto(button, activar) {
        const id = button.getAttribute("data-id");
        const titulo = button.getAttribute("data-titulo");
        const accion = activar ? "activar" : "desactivar";

        // Crear modal de confirmación
        const modalId = `modalConfirmar${accion.charAt(0).toUpperCase() + accion.slice(1)}`;

        // Remover modal existente si existe
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }

        // Crear nuevo modal
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirmar ${accion}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>¿Está seguro de que desea ${accion} el producto <strong>"${titulo}"</strong>?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-${activar ? 'success' : 'warning'}" id="btnConfirmar${accion.charAt(0).toUpperCase() + accion.slice(1)}">
                            Confirmar ${accion}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        
        // Mostrar modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();


        // Configurar evento del botón confirmar
        const btnConfirmar = modal.querySelector(`#btnConfirmar${accion.charAt(0).toUpperCase() + accion.slice(1)}`);
        btnConfirmar.addEventListener('click', async () => {
            try {
                const token = localStorage.getItem("token");
                await apiClient.fetchAPI(`productos/${id}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ activo: activar })
                });

                bsModal.hide();

                // Recargar productos
                await cargarProductos();

                console.log(`Producto ${activar ? 'activado' : 'desactivado'} exitosamente`);
            } catch (error) {
                console.error(`Error al ${accion} producto:`, error);
                alert(`Error al ${accion} producto: ${error.message}`);
            }
        });


        // Limpiar modal después de cerrarlo
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    populateForm(formId, data, fieldsMapping) {
        console.log("[populateForm] Estructura recibida:", data);
        let flatData = data;

        if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data) &&
            Object.keys(data).length === 1 &&
            typeof Object.values(data)[0] === "object"
        ) {
            flatData = Object.values(data)[0];
            console.log("[populateForm] Usando objeto anidado:", flatData);
        }

        Object.entries(fieldsMapping).forEach(([fieldId, dataKey]) => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.tagName === "SELECT") {
                    field.value = String(flatData[dataKey] ?? "");
                } else {
                    field.value = flatData[dataKey] ?? "";
                }
                console.log(`[populateForm] Asignando a #${fieldId} el valor:`, flatData[dataKey]);
            }
        });
    }

    async handleFormSubmit(formId, event) {
        const config = this.configs.get(formId);
        if (!config) return;

        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);


        // Debug: Mostrar valores del formulario
        console.log("[DEBUG] Valores del formulario:", formValues);

        const apiData = {};
        Object.entries(config.fieldsMapping).forEach(([htmlFieldId, apiFieldName]) => {
            const value = formValues[htmlFieldId];
            if (value !== undefined && value !== "") {
                console.log(apiData[apiFieldName] = value);
                apiData[apiFieldName] = value;
            }
        });

        // Conversión de tipos para campos numéricos y booleanos
        if (apiData.capacidad !== undefined) apiData.capacidad = Number(apiData.capacidad);
        if (apiData.precio_hora !== undefined) apiData.precio_hora = Number(apiData.precio_hora);
        if (apiData.activo !== undefined) apiData.activo = apiData.activo === "true";

        // Validación adicional para producto
        if (formId === "formAgregarProducto") {
            if (!apiData.tipo_producto_id || isNaN(apiData.tipo_producto_id)) {
                alert("Debe seleccionar un tipo de producto válido");
                return;
            }
        }

        console.log("[handleFormSubmit] Datos a enviar a la API:", apiData);

        try {
            const token = localStorage.getItem("token");
            let response;

            if (config.isCreate) {
                // Crear nuevo registro
                response = await apiClient.fetchAPI(config.apiEndpoint, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(apiData)
                });
            } else {
                // Actualizar registro existente
                if (!this.currentEditingId) {
                    config.onError("No se encontró el ID del registro a actualizar");
                    return;
                }

                response = await apiClient.fetchAPI(`${config.apiEndpoint}/${this.currentEditingId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(apiData)
                });
            }

            console.log("[handleFormSubmit] Respuesta de la API:", response);

            this.hideEditCard(config.cardId);
            this.currentEditingId = null;

            // Limpiar formulario si es de creación
            if (config.isCreate) {
                const form = document.getElementById(formId);
                if (form) form.reset();
            }

            config.onSuccess();
            config.reloadFunction();
        } catch (error) {
            console.error("[handleFormSubmit] Error completo:", error);
            config.onError(`Error al ${config.isCreate ? 'crear' : 'actualizar'}: ${error.message}`);
        }
    }

    showEditCard(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.classList.remove("d-none");
            card.scrollIntoView({ behavior: "smooth" });
        }
    }

    hideEditCard(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.classList.add("d-none");
        }
    }
}

// Instanciar el manager
const editFormManager = new EditFormManager();

// Función helper para registrar múltiples formularios
function registerMultipleEditForms(configs) {
    configs.forEach(config => {
        editFormManager.registerEditForm(config);
    });
}

// Configuración de formularios de edición
const formsConfig = [
    {
        formId: "formEditarUsuario",
        cardId: "cardEditarUsuario",
        cancelButtonId: "btnCancelarEdicionUsuario",
        editButtonClass: "btn-editar-usuario",
        apiEndpoint: "usuarios",
        fieldsMapping: {
            "editar-id-usuario": "usuario_id",
            "editar-nombre": "nombre",
            "editar-apellido": "apellido",
            "editar-email": "email",
            "editar-rol": "rol_id"
        },
        onSuccess: () => {
            console.log("Usuario actualizado exitosamente");
        },
        onError: (error) => {
            console.error("Error al actualizar usuario:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => {
            document.querySelector("#tablaEmpleados tbody").innerHTML = "";
            cargarEmpleados();
        }
    },
    {
        formId: "formEditarProducto",
        cardId: "cardEditarProducto",
        cancelButtonId: "btnCancelarEdicionProducto",
        editButtonClass: "btn-editar-producto",
        apiEndpoint: "productos",
        fieldsMapping: {
            "editar-id-producto": "producto_id",
            "editar-tipo-producto": "tipo_producto_id",
            "editar-titulo": "titulo",
            "editar-descripcion": "descripcion",
            "editar-capacidad": "capacidad",
            "editar-normas": "normas",
            "editar-activo": "activo",
            "editar-precio": "precioxdia"
        },
        onSuccess: () => {
            console.log("Producto actualizado exitosamente");
        },
        onError: (error) => {
            console.error("Error al actualizar producto:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => {
            cargarProductos();
        }
    },
    {
        formId: "formAgregarProducto",
        cardId: "cardAgregarProducto",
        cancelButtonId: "btnCancelarAgregarProducto",
        editButtonClass: "btnAgregarProducto",
        apiEndpoint: "productos",
        fieldsMapping: {
            "agregar-tipo-producto": "tipo_producto_id",
            "agregar-titulo": "titulo",
            "agregar-descripcion": "descripcion",
            "agregar-capacidad": "capacidad",
            "agregar-normas": "normas",
            "agregar-precio": "precio_hora"
        },
        isCreate: true, // Marcar como formulario de creación
        onSuccess: () => {
            console.log("Producto agregado exitosamente");
        },
        onError: (error) => {
            console.error("Error al agregar producto:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => {
            cargarProductos();
        }
    },
        {
        formId: "formAgregarEmpleado",
        cardId: "cardAgregarEmpleado",
        cancelButtonId: "btnCancelarAgregarEmpleado",
        editButtonClass: "btnAgregarEmpleado",
        apiEndpoint: "auth/register",
        fieldsMapping: {
            "agregar-rol": "rol_id",
            "agregar-nombre": "nombre",
            "agregar-apellido": "apellido",
            "agregar-email": "email",
            "agregar-contrasena": "contraseña",
            "agregar-telefono": "telefono"
        },
        isCreate: true, // Marcar como formulario de creación
        onSuccess: () => {
            console.log("Producto agregado exitosamente");
        },
        onError: (error) => {
            console.error("Error al agregar producto:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => {
            cargarEmpleados();
        }
    }
];

// Registrar todos los formularios
registerMultipleEditForms(formsConfig);

// Cargar empleados (función original)
async function cargarEmpleados() {
    const tabla = document.getElementById("tablaEmpleados");
    const tbody = tabla.querySelector("tbody");

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login-admin.html";
            return;
        }

        const res = await apiClient.fetchAPI("usuarios", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API usuarios:", res);

        const empleados = Array.isArray(res) ? res : res.usuarios;

        if (!empleados || empleados.length === 0) {
            throw new Error("No se encontraron empleados.");
        }

        tbody.innerHTML = ""; // ✅ Soluciona duplicados

        empleados.forEach(emp => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${emp.usuario_id}</td>
                <td>${emp.nombre}</td>
                <td>${emp.apellido}</td>
                <td>${emp.email}</td>
                <td>${emp.rol_id || "Sin rol"}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar-usuario" data-id="${emp.usuario_id}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar-usuario" data-id="${emp.usuario_id}" data-nombre="${emp.nombre}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        tabla.classList.remove("d-none");
        document.querySelector("#divListadoEmpleados .spinner-border")?.remove();
    } catch (error) {
        console.error("Error al cargar empleados:", error.message);
        document.querySelector("#divListadoEmpleados").innerHTML = `
            <div class="alert alert-danger">Error al cargar empleados: ${error.message}</div>
        `;
    }
}

// Actualizar métricas del dashboard
async function actualizarMetricasDashboard() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login-admin.html";
            return;
        }

        const res1 = await apiClient.fetchAPI("productos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API productos:", res1);
        const productos = Array.isArray(res1) ? res1 : res1.productos;

        const res2 = await apiClient.fetchAPI("usuarios", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API usuarios:", res2);
        const usuarios = Array.isArray(res2) ? res2 : res2.usuarios;

        const res3 = await apiClient.fetchAPI("reserva", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API productos:", res3);
        const reservas = Array.isArray(res3) ? res3 : res3.reservas;

        const res4 = await apiClient.fetchAPI("ticket", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API productos:", res4);
        const tickets = Array.isArray(res4) ? res4 : res4.tickets;

        if (usuarios && usuarios.length > 0) {
            document.getElementById("initials-name").textContent = `${usuarios[0].nombre.charAt(0)}${usuarios[0].apellido.charAt(0)}`.toUpperCase();
            document.getElementById("name-admin").textContent = `${usuarios[0].nombre} ${usuarios[0].apellido}`;
            document.getElementById("count-empleados").textContent = usuarios.length;
        }

        if (productos && productos.length > 0) {
            document.getElementById("count-productos").textContent = productos.length;
        }

        if (reservas && reservas.length > 0) {
            document.getElementById("count-reservas").textContent = reservas.length;
        }

        if (tickets && tickets.length > 0) {
            document.getElementById("count-tickets").textContent = tickets.length;
        }


    } catch (error) {
        console.error("Error al cargar métricas del dashboard:", error.message);

        if (error.message.includes("401") || (error.response && error.response.status === 401)) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            window.location.href = "login-admin.html";
        }
    }
}

// Inicializar todo al cargar la página
window.addEventListener('load', function () {
    cargarEmpleados();
    cargarProductos();
    cargarReservas();
    cargarTickets();
    actualizarMetricasDashboard();

    // Configuración adicional para el botón agregar producto
    setupAgregarProductoButton();
});

// Función para asegurar que el botón "Agregar producto" funcione
function setupAgregarProductoButton() {
    // Buscar el botón por diferentes métodos
    const btnAgregar = document.getElementById("btnAgregarProducto")

    if (btnAgregar) {
        console.log("Botón 'Agregar producto' encontrado:", btnAgregar);

        // Remover listeners previos para evitar duplicados
        btnAgregar.removeEventListener("click", handleAgregarProductoClick);

        // Agregar listener específico
        btnAgregar.addEventListener("click", handleAgregarProductoClick);

        // También agregar la clase esperada por el EditFormManager
        btnAgregar.classList.add("btnAgregarProducto");
    } else {
        console.warn("No se encontró el botón 'Agregar producto'. Verifica que tenga id='btnAgregarProducto'");
    }
}

// Función específica para manejar el click del botón agregar
function handleAgregarProductoClick(e) {
    console.log("Botón 'Agregar producto' clickeado");
    e.preventDefault();
    e.stopPropagation();

    // Llamar directamente al método del EditFormManager
    editFormManager.handleCreateClick("formAgregarProducto");
}


// Cargar empleados (función original)
// Función mejorada para cargar reservas
async function cargarReservas() {
    const tabla = document.getElementById("tablaReservas");
    const tbody = tabla.querySelector("tbody");
    try {
        const token = localStorage.getItem("token");
        
        if (!token) {
            window.location.href = "login-admin.html";
            return;
        }

        const res = await apiClient.fetchAPI("reserva", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API reservas:", res);

        const reservas = Array.isArray(res) ? res : res.usuarios || [];

        tbody.innerHTML = ""; // Limpiar tabla

        if (reservas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-4 text-muted">
                        No se encontraron reservas
                    </td>
                </tr>
            `;
        } else {
            reservas.forEach(reser => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${reser.reserva_id}</td>
                    <td>${reser.producto_id}</td>
                    <td>${reser.nombre_usuario || 'Reserva sin nombre'}</td>
                    <td>${reser.dia_reserva || 'null'}</td>
                    <td>${reser.hora_llegada || '00:00:00'}</td>
                    <td>${reser.hora_salida || '00:00:00'}</td>
                    <td>${reser.cantidad_personas}</td>
                    <td>$${parseFloat(reser.monto_total).toFixed(2)}</td>
                    <td>${new Date(reser.registro_fecha_reserva).toLocaleString()}</td>
                `;
                tbody.appendChild(fila);
            });
        }

        tabla.classList.remove("d-none");
        const spinner = document.querySelector("#divListadoReservas .spinner-border");
        if (spinner) spinner.remove();
        
    } catch (error) {
        console.error("Error al cargar reservas:", error.message);
        document.querySelector("#divListadoReservas").innerHTML = `
            <div class="alert alert-danger">Error al cargar reservas: ${error.message}</div>
        `;
    }
}


async function cargarTickets() {
    const tabla = document.getElementById("tablaTickets");
    const tbody = tabla.querySelector("tbody");
    try {
        const token = localStorage.getItem("token");
        
        if (!token) {
            window.location.href = "login-admin.html";
            return;
        }

        const res = await apiClient.fetchAPI("ticket", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API tickets:", res);

        const tickets = Array.isArray(res) ? res : res.tickets || [];

        tbody.innerHTML = ""; // Limpiar tabla

        if (tickets.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center py-4 text-muted">
                        No se encontraron ticket
                    </td>
                </tr>
            `;
        } else {
            tickets.forEach(tckt => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${tckt.ticket_id}</td>
                    <td>${tckt.reserva_id}</td>
                    <td>${tckt.nombre_usuario}</td>
                    <td>${tckt.fecha_emision}</td>
                    <td>${tckt.estado || "generado"}</td>
                `;
                tbody.appendChild(fila);
            });
        }

        tabla.classList.remove("d-none");
        const spinner = document.querySelector("#divListadoTickets .spinner-border");
        if (spinner) spinner.remove();
        
    } catch (error) {
        console.error("Error al cargar reservas:", error.message);
        document.querySelector("#divListadoReservas").innerHTML = `
            <div class="alert alert-danger">Error al cargar reservas: ${error.message}</div>
        `;
    }
}

document.getElementById('logout-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Limpiar localStorage
    localStorage.clear();
    
    // Redirigir a login
    window.location.href = 'login-admin.html';
});

// Configurar listeners para filtrado
document.getElementById('btnFiltrarTipo')?.addEventListener('click', async () => {
    const tipo = document.getElementById('inputFiltrarTipo').value;
    if (tipo && !isNaN(tipo)) {
        await cargarProductos(parseInt(tipo)); // Filtrado local
    } else {
        alert("Por favor ingrese un número válido para el tipo de producto");
    }
});

document.getElementById('btnResetFiltro')?.addEventListener('click', async () => {
    document.getElementById('inputFiltrarTipo').value = '';
    await cargarProductos(); // Mostrar todos sin filtrar
});

