// // Wrapper para manejar errores de autenticación
// async function safeFetchAPI(endpoint, options = {}) {
//     try {
//         const response = await apiClient.fetchAPI(endpoint, options);
//         return response;
//     } catch (error) {
//         // Verificar si el error es 401 (Token expirado)
//         if (error.message.includes("401") || (error.response && error.response.status === 401)) {
//             // Limpiar el localStorage y redirigir al login
//             localStorage.removeItem('token');
//             localStorage.removeItem('userRole');
//             window.location.href = "login-admin.html";
//             return Promise.reject(new Error("Sesión expirada, por favor inicie sesión nuevamente"));
//         }
//         throw error;
//     }
// }

// Cargar empleados desde la API
async function cargarEmpleados() {
    const tabla = document.getElementById("tablaEmpleados");
    const tbody = tabla.querySelector("tbody");

    try {
        // Obtener token del localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            // Redirigir al login si no hay token
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
                    <button class="btn btn-sm btn-danger">Eliminar</button>
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

// Cargar productos desde la API
async function cargarProductos() {
    const tabla = document.getElementById("tablaProductos");
    const tbody = tabla.querySelector("tbody");

    try {
        // Obtener token del localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            // Redirigir al login si no hay token
            window.location.href = "login-admin.html";
            return;
        }

        const res = await apiClient.fetchAPI("productos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API productos:", res);

        const productos = Array.isArray(res) ? res : res.productos;

        if (!productos || productos.length === 0) {
            throw new Error("No se encontraron productos.");
        }

        productos.forEach(p => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${p.producto_id}</td>
                <td>${p.tipo_producto_id}</td>
                <td>${p.titulo}</td>
                <td>${p.descripcion}</td>
                <td>${p.capacidad}</td>
                <td>${p.normas}</td>
                <td>${p.activo}</td>
                <td>${p.fecha_creacion}</td>
                <td>${p.precioxdia}</td>
                <td>
                    <button class="btn btn-sm btn-primary btn-editar-producto" data-id="${p.producto_id}">Editar</button>
                    <button class="btn btn-sm btn-danger">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        tabla.classList.remove("d-none");
        const spinner = document.querySelector("#divListadoProductos .spinner-border");
        if (spinner) spinner.remove();
    } catch (error) {
        console.error("Error al cargar productos:", error.message);
        document.querySelector("#divListadoProductos").innerHTML = `
            <div class="alert alert-danger">Error al cargar productos: ${error.message}</div>
        `;
    }
}

async function actualizarMetricasDashboard() {
    try {
        // Obtener token del localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            // Redirigir al login si no hay token
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
        // ✅ CORRECCIÓN: Cambiar res.productos por res1.productos
        const productos = Array.isArray(res1) ? res1 : res1.productos;

        const res2 = await apiClient.fetchAPI("usuarios", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log("Respuesta de API usuarios:", res2);
        const usuarios = Array.isArray(res2) ? res2 : res2.usuarios;

        // Actualizar valores en las cards
        if (usuarios && usuarios.length > 0) {
            document.getElementById("initials-name").textContent = `${usuarios[0].nombre.charAt(0)}${usuarios[0].apellido.charAt(0)}`.toUpperCase();
            document.getElementById("name-admin").textContent = `${usuarios[0].nombre} ${usuarios[0].apellido}`;
            document.getElementById("count-empleados").textContent = usuarios.length;
        }
        
        if (productos && productos.length > 0) {
            document.getElementById("count-productos").textContent = productos.length;
        }

    } catch (error) {
        console.error("Error al cargar métricas del dashboard:", error.message);

         // Verificar si el error es 401 (Token expirado)
        if (error.message.includes("401") || (error.response && error.response.status === 401)) {
            // Limpiar el localStorage y redirigir al login
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            window.location.href = "login-admin.html";
        }
    }
}

// Sistema de edición genérico
class EditFormManager {
    constructor() {
        this.configs = new Map();
        this.currentEditingId = null;
        this.initializeEventListeners();
    }

    // Registrar configuración para un formulario de edición
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
            reloadFunction
        } = config;

        this.configs.set(formId, {
            cardId,
            cancelButtonId,
            editButtonClass,
            apiEndpoint,
            fieldsMapping,
            onSuccess: onSuccess || (() => { }),
            onError: onError || ((error) => console.error(error)),
            reloadFunction: reloadFunction || (() => { })
        });

        this.setupFormListeners(formId);
        this.setupCancelButton(formId);
    }

    // Configurar listeners del formulario
    setupFormListeners(formId) {
        const form = document.getElementById(formId);
        const config = this.configs.get(formId);

        if (!form || !config) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await this.handleFormSubmit(formId, e);
        });
    }

    // Configurar botón cancelar
    setupCancelButton(formId) {
        const config = this.configs.get(formId);
        if (!config) return;

        const cancelButton = document.getElementById(config.cancelButtonId);
        if (cancelButton) {
            cancelButton.addEventListener("click", () => {
                this.hideEditCard(config.cardId);
                this.currentEditingId = null; // ✅ MEJORA: Limpiar ID
            });
        }
    }

    // Inicializar listeners globales
    initializeEventListeners() {
        // Delegación de eventos para botones de editar
        document.addEventListener("click", async (e) => {
            // Buscar qué configuración coincide con el botón clickeado
            for (const [formId, config] of this.configs) {
                if (e.target.classList.contains(config.editButtonClass)) {
                    await this.handleEditClick(formId, e.target);
                    break;
                }
            }
        });
    }

    // Manejar click en botón editar
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

    // Limpieza y robustez en el llenado del formulario
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
                // Si es select, setear value correctamente
                if (field.tagName === "SELECT") {
                    field.value = String(flatData[dataKey] ?? "");
                } else {
                    field.value = flatData[dataKey] ?? "";
                }
                console.log(`[populateForm] Asignando a #${fieldId} el valor:`, flatData[dataKey]);
            }
        });
    }

    // ✅ CORRECCIÓN PRINCIPAL: Manejar envío del formulario
    async handleFormSubmit(formId, event) {
        const config = this.configs.get(formId);
        if (!config) return;

        if (!this.currentEditingId) {
            config.onError("No se encontró el ID del registro a actualizar");
            return;
        }

        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);

        const apiData = {};
        Object.entries(config.fieldsMapping).forEach(([htmlFieldId, apiFieldName]) => {
            const value = formValues[htmlFieldId];
            if (value !== undefined) {
                apiData[apiFieldName] = value;
            }
        });

        // Conversión de tipos para campos numéricos y booleanos
        if (apiData.capacidad !== undefined) apiData.capacidad = Number(apiData.capacidad);
        if (apiData.precioxdia !== undefined) apiData.precioxdia = Number(apiData.precioxdia);
        if (apiData.activo !== undefined) apiData.activo = apiData.activo === "true";
        console.log("[handleFormSubmit] Datos a enviar a la API:", apiData);
        try {
            const token = localStorage.getItem("token");
            const response = await apiClient.fetchAPI(`${config.apiEndpoint}/${this.currentEditingId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiData)
            });

            console.log("[handleFormSubmit] Respuesta de la API:", response);

            this.hideEditCard(config.cardId);
            this.currentEditingId = null;
            config.onSuccess();
            config.reloadFunction();
        } catch (error) {
            console.error("[handleFormSubmit] Error completo:", error);
            config.onError(`Error al actualizar: ${error.message}`);
        }
    }

    // Mostrar card de edición
    showEditCard(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.classList.remove("d-none");
            card.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Ocultar card de edición
    hideEditCard(cardId) {
        const card = document.getElementById(cardId);
        if (card) {
            card.classList.add("d-none");
        }
    }
}

const editFormManager = new EditFormManager();

// Función helper para registrar múltiples formularios fácilmente
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
            "editar-id": "usuario_id",
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
            "editar-id": "producto_id",
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
            document.querySelector("#tablaProductos tbody").innerHTML = "";
            cargarProductos();
        }
    }
];

registerMultipleEditForms(formsConfig);

// Inicializar todo al cargar la página
window.addEventListener('load', function () {
    cargarEmpleados();
    cargarProductos();
    actualizarMetricasDashboard();
});
