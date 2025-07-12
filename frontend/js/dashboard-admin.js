// ========================================
// CLASE PARA MANEJO GLOBAL DE SEGURIDAD
// ========================================
class SecurityManager {
    constructor() {
        this.token = null;
        this.isValidatingToken = false;
        this.redirectTimeout = null;
        this.init();
    }

    init() {
        this.setupTokenValidation();
        this.setupVisibilityListener();
        this.setupStorageListener();
    }

    // Verificar token al cargar la página
    async validateInitialToken() {
        const token = localStorage.getItem("token");

        if (!token) {
            this.redirectToLogin("No hay token disponible");
            return false;
        }

        try {
            // Hacer una petición ligera para verificar si el token es válido
            const response = await apiClient.fetchAPI("auth/validate", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            this.token = token;
            return true;
        } catch (error) {
            console.error("Token inválido o expirado:", error);
            this.handleTokenExpired();
            return false;
        }
    }

    // Configurar validación periódica del token
    setupTokenValidation() {
        // Verificar token cada 5 minutos
        setInterval(() => {
            this.validateTokenSilently();
        }, 5 * 60 * 1000);
    }

    // Verificar token sin interrumpir la experiencia del usuario
    async validateTokenSilently() {
        if (this.isValidatingToken) return;

        const token = localStorage.getItem("token");
        if (!token) {
            this.handleTokenExpired();
            return;
        }

        try {
            this.isValidatingToken = true;
            await apiClient.fetchAPI("auth/validate", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Token expirado en validación silenciosa:", error);
            this.handleTokenExpired();
        } finally {
            this.isValidatingToken = false;
        }
    }

    // Manejar token expirado
    handleTokenExpired() {
        console.log("Token expirado, redirigiendo al login...");

        // Limpiar storage inmediatamente
        this.clearSession();

        // Mostrar mensaje al usuario
        this.showTokenExpiredMessage();

        // Redirigir después de un breve delay
        this.redirectToLogin("Token expirado");
    }

    // Limpiar sesión completamente
    clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        this.token = null;
    }

    // Mostrar mensaje de token expirado
    showTokenExpiredMessage() {
        // Crear overlay de mensaje
        const overlay = document.createElement('div');
        overlay.id = 'token-expired-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 18px;
            text-align: center;
        `;

        overlay.innerHTML = `
            <div style="background: #dc3545; padding: 20px; border-radius: 10px; max-width: 400px;">
                <h4>Sesión Expirada</h4>
                <p>Su sesión ha expirado. Será redirigido al login...</p>
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    // Redirigir a login con mensaje
    redirectToLogin(reason = "") {
        if (this.redirectTimeout) {
            clearTimeout(this.redirectTimeout);
        }

        this.redirectTimeout = setTimeout(() => {
            console.log(`Redirigiendo a login: ${reason}`);
            window.location.href = "login-admin.html";
        }, 2000); // 2 segundos para que el usuario vea el mensaje
    }

    // Interceptar respuestas 401 globalmente
    setupResponseInterceptor() {
        // Sobrescribir fetch para interceptar respuestas 401
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);

                if (response.status === 401) {
                    console.warn("Respuesta 401 interceptada");
                    this.handleTokenExpired();
                }

                return response;
            } catch (error) {
                throw error;
            }
        };
    }

    // Escuchar cambios en el localStorage (para múltiples pestañas)
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'token' && !e.newValue) {
                console.log("Token removido en otra pestaña");
                this.redirectToLogin("Token removido en otra pestaña");
            }
        });
    }

    // Verificar token cuando la página vuelve a estar visible
    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.validateTokenSilently();
            }
        });
    }

    // Método público para verificar si hay token válido
    hasValidToken() {
        return !!localStorage.getItem("token");
    }
}

// ========================================
// CLASE GENÉRICA PARA MANEJO DE TABLAS
// ========================================
class TableManager {
    constructor() {
        this.configs = new Map()
        this.securityManager = new SecurityManager(); // Instancia de SecurityManager para verificar el token
    }

    //Registrar configuracion de la tabla
    registerTable(config) {
        const {
            tableId, //tabla a manejar
            apiEndpoint, //endpoint de la API para obtener los datos
            dataKey = null, // clave del objeto que contiene los datos (si es necesario)
            columns, // columnas de la tabla
            noDataMessage = "No data available", // mensaje a mostrar si no hay datos
            customRowRenderer = null, // función personalizada para renderizar filas
            onLoadError = null, // función a ejecutar en caso de error al cargar los datos
            filterFunction = null // función para filtrar los datos antes de renderizar
        } = config;

        this.configs.set(tableId, {
            apiEndpoint,
            dataKey,
            columns,
            noDataMessage,
            customRowRenderer,
            onLoadError,
            filterFunction
        });
    }

    async loadData(tableId, filter = null) {
        const config = this.configs.get(tableId);
        if (!config) {
            console.error("No se encontró la configuración para la tabla:", tableId);
            return;
        }

        const tabla = document.getElementById(tableId);
        const tbody = tabla.querySelector("tbody");

        // 1. VERIFICAR TOKEN ANTES DE CUALQUIER ACCIÓN
        if (!this.securityManager.hasValidToken()) {
            this.securityManager.handleTokenExpired();
            return;
        }

        const token = localStorage.getItem("token");

        //Mostrar Spinner
        this.showSpinner(tbody, config.columns.length);

        try {
            //Hacer la petición a la API
            const res = await apiClient.fetchAPI(config.apiEndpoint, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("Respuesta de la API:", res);

            //Extraer datos de la respuesta
            let data = this.extractData(res, config.dataKey);

            //Aplicar filtro si se proporciona
            if (filter && config.filterFunction) {
                data = config.filterFunction(data, filter);
            }

            // Remover spinner si existe
            this.removeSpinner(tbody);

            //Limpiar el cuerpo de la tabla
            tbody.innerHTML = "";

            //Mostrar datos o mensajes vacio
            if (data.length === 0) {
                this.showNoDataMessage(tbody, config.columns.length, config.noDataMessage);
            } else {
                this.renderRows(tbody, data, config.columns, config.customRowRenderer);
            }

            //Mostrar tabla
            tabla.classList.remove("d-none");

        } catch (error) {
            console.error("Error al cargar los datos:", error);
            this.removeSpinner(tbody);
            // Limpiar tbody antes de mostrar error
            tbody.innerHTML = "";

            this.showError(tbody, config.columns.length, error.message);

            if (config.onLoadError) {
                config.onLoadError(error);
            }
        }
    }

    // Extraer datos de diferentes formatos de respuesta
    extractData(response, dataKey) {
        if (Array.isArray(response)) {
            return response; // Si es un array, devolverlo directamente
        }

        if (dataKey && response[dataKey]) {
            return response[dataKey]; // Si hay una clave específica, devolver los datos de esa clave
        }

        //Intentar con claves comunes
        const commonKeys = ["data", "productos", "usuarios", "reservas", "tickets"];
        for (const key of commonKeys) {
            if (response[key]) {
                return response[key];
            }
        }

        return []; // Si no se encuentra nada, devolver un array vacío
    }

    showSpinner(tbody, columnCount) {
        tbody.innerHTML = `
        <tr>
            <td colspan="${columnCount}" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
        `;
    }

    // Mostrar mensaje cuando no hay datos
    showNoDataMessage(tbody, columnCount, message) {
        tbody.innerHTML = `
            <tr>
                <td colspan="${columnCount}" class="text-center py-4 text-muted">
                    ${message}
                </td>
            </tr>
        `;
    }

    // Mostrar mensaje de error
    showError(tbody, columnCount, errorMessage) {
        tbody.innerHTML = `
            <tr>
                <td colspan="${columnCount}" class="text-center py-4 text-danger">
                    Error al cargar datos: ${errorMessage}
                </td>
            </tr>
        `;
    }

    // Renderizar filas de la tabla
    renderRows(tbody, data, columns, customRowRenderer) {
        data.forEach(item => {
            const fila = document.createElement("tr");

            if (customRowRenderer) {
                fila.innerHTML = customRowRenderer(item);
            } else {
                const cells = columns.map(col => {
                    if (typeof col.render === 'function') {
                        return col.render(item);
                    }
                    return `<td>${item[col.key] || ''}</td>`;
                }).join('');
                fila.innerHTML = cells;
            }
            tbody.appendChild(fila);
        });
    }

    // Remover spinner
    removeSpinner(tbody) {
        // Método más robusto: remover por clase específica
        const spinnerRow = tbody.querySelector('.spinner-row');
        if (spinnerRow) {
            spinnerRow.remove();
        }

        // Método de respaldo: buscar por spinner-border
        const spinner = tbody.querySelector('.spinner-border');
        if (spinner) {
            const row = spinner.closest('tr');
            if (row) {
                row.remove();
            }
        }
    }
}


// ========================================
// INSTANCIA GLOBAL DEL TABLE MANAGER
// ========================================
const tableManager = new TableManager();


// ========================================
// CONFIGURACIONES DE TABLAS
// ========================================

// Configuración para tabla de productos
tableManager.registerTable({
    tableId: "tablaProductos",
    apiEndpoint: "productos",
    columns: [
        { key: "producto_id" },
        { key: "tipo_producto_id" },
        { key: "titulo" },
        { key: "descripcion" },
        { key: "capacidad" },
        { key: "normas" },
        {
            key: "activo",
            render: (item) => {
                const estadoTexto = item.activo ? "Activo" : "inactivo";
                const estadoClase = item.activo ? "text-success" : "text-danger";
                return `<td class="${estadoClase}">${estadoTexto}</td>`;
            }
        },
        { key: "fecha_creacion" },
        {
            key: "precio_hora",
            render: (item) => `<td>$${item.precio_hora}</td>`
        }
    ],
    noDataMessage: "No se encontraron productos",
    customRowRenderer: (producto) => `
        <td>${producto.producto_id}</td>
        <td>${producto.tipo_producto_id}</td>
        <td>${producto.titulo}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.capacidad}</td>
        <td>${producto.normas}</td>
        <td><span class="${producto.activo ? 'text-success' : 'text-danger'}">${producto.activo ? 'Activo' : 'Inactivo'}</span></td>
        <td>${producto.fecha_creacion}</td>
        <td>$${producto.precio_hora}</td>
        <td>
            <button class="btn btn-sm btn-primary btn-editar-producto" data-id="${producto.producto_id}">Editar</button>
            ${producto.activo ?
            `<button class="btn btn-sm btn-warning btn-desactivar-producto ms-1" data-id="${producto.producto_id}" data-titulo="${producto.titulo}">Desactivar</button>` :
            `<button class="btn btn-sm btn-success btn-activar-producto ms-1" data-id="${producto.producto_id}" data-titulo="${producto.titulo}">Activar</button>`
        }
        </td>
    `,
    filterFunction: (productos, tipoFiltro) => {
        if (tipoFiltro && !isNaN(tipoFiltro)) {
            return productos.filter(producto => producto.tipo_producto_id === parseInt(tipoFiltro));
        }
        return productos; // Si no hay filtro, devolver todos los productos
    }
})

// Configuración para tabla de empleados
tableManager.registerTable({
    tableId: "tablaEmpleados",
    apiEndpoint: "usuarios",
    columns: [
        { key: "usuario_id" },
        { key: "nombre" },
        { key: "apellido" },
        { key: "email" },
        { key: "rol_id" }
    ],
    noDataMessage: "No se encontraron empleados",
    customRowRenderer: (empleado) => `
        <td>${empleado.usuario_id}</td>
        <td>${empleado.nombre}</td>
        <td>${empleado.apellido}</td>
        <td>${empleado.email}</td>
        <td>${empleado.rol_id || "Sin rol"}</td>
        <td>
            <button class="btn btn-sm btn-primary btn-editar-usuario" data-id="${empleado.usuario_id}">Editar</button>
            <button class="btn btn-sm btn-danger btn-eliminar-usuario" data-id="${empleado.usuario_id}" data-nombre="${empleado.nombre}">Eliminar</button>
        </td>
    `
});

//Configuración para tabla de reservas
tableManager.registerTable({
    tableId: "tablaReservas",
    apiEndpoint: "reserva",
    columns: [
        { key: "reserva_id" },
        { key: "producto_id" },
        { key: "nombre_usuario" },
        { key: "dia_reserva" },
        { key: "hora_llegada" },
        { key: "hora_salida" },
        { key: "cantidad_personas" },
        { key: "monto_total" },
        { key: "registro_fecha_reserva" }
    ],
    noDataMessage: "No se encontraron reservas",
    customRowRenderer: (reserva) => `
        <td>${reserva.reserva_id}</td>
        <td>${reserva.producto_id}</td>
        <td>${reserva.nombre_usuario || 'Reserva sin nombre'}</td>
        <td>${reserva.dia_reserva || 'null'}</td>
        <td>${reserva.hora_llegada || '00:00:00'}</td>
        <td>${reserva.hora_salida || '00:00:00'}</td>
        <td>${reserva.cantidad_personas}</td>
        <td>$${parseFloat(reserva.monto_total).toFixed(2)}</td>
        <td>${new Date(reserva.registro_fecha_reserva).toLocaleString()}</td>
    `
});


//Configuración para tabla de tickets
tableManager.registerTable({
    tableId: "tablaTickets",
    apiEndpoint: "ticket",
    columns: [
        { key: "ticket_id" },
        { key: "reserva_id" },
        { key: "nombre_usuario" },
        { key: "fecha_emision" },
        { key: "estado" }
    ],
    noDataMessage: "No se encontraron tickets",
    customRowRenderer: (ticket) => `
        <td>${ticket.ticket_id}</td>
        <td>${ticket.reserva_id}</td>
        <td>${ticket.nombre_usuario}</td>
        <td>${ticket.fecha_emision}</td>
        <td>${ticket.estado || "generado"}</td>
    `
});

// ========================================
// FUNCIONES SIMPLIFICADAS
// ========================================
// Funciones de carga ahora son wrappers simples
async function cargarProductos(tipoFiltro = null) {
    await tableManager.loadData("tablaProductos", tipoFiltro);
}

async function cargarEmpleados() {
    await tableManager.loadData("tablaEmpleados");
}

async function cargarReservas() {
    await tableManager.loadData("tablaReservas");
}

async function cargarTickets() {
    await tableManager.loadData("tablaTickets");
}


// ========================================
// CLASE PARA MANEJO DE MÉTRICAS
// ========================================
class MetricsManager {
    constructor() {
        this.endpoints = {
            productos: "productos",
            usuarios: "usuarios",
            reservas: "reserva",
            tickets: "ticket"
        };
        this.securityManager = new SecurityManager(); // Instancia de SecurityManager para verificar el token
    }

    async updateDashboardMetrics() {
        try {
            // VERIFICAR TOKEN ANTES DE CARGAR MÉTRICAS
            if (!this.securityManager.hasValidToken()) {
                this.securityManager.handleTokenExpired();
                return;
            }

            const token = localStorage.getItem("token");

            // Cargar todos los datos en paralelo
            const promises = Object.entries(this.endpoints).map(async ([key, endpoint]) => {
                try {
                    const res = await apiClient.fetchAPI(endpoint, {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    return { key, data: this.extractData(res, key) };
                } catch (error) {
                    console.error(`Error al cargar ${key}:`, error);
                    return { key, data: [] };
                }
            });

            const results = await Promise.all(promises);

            // Actualizar contadores
            results.forEach(({ key, data }) => {
                const countElement = document.getElementById(`count-${key}`);
                if (countElement) {
                    countElement.textContent = data.length;
                }
            });

            // Actualizar información del usuario admin
            const usuarios = results.find(r => r.key === 'usuarios')?.data || [];
            if (usuarios.length > 0) {
                const admin = usuarios[0];
                const initialsElement = document.getElementById("initials-name");
                const nameElement = document.getElementById("name-admin");

                if (initialsElement) {
                    initialsElement.textContent = `${admin.nombre.charAt(0)}${admin.apellido.charAt(0)}`.toUpperCase();
                }
                if (nameElement) {
                    nameElement.textContent = `${admin.nombre} ${admin.apellido}`;
                }
            }

        } catch (error) {
            console.error("Error al cargar métricas del dashboard:", error);

            // Manejar errores 401 a nivel general
            if (error.message.includes("401") || (error.response && error.response.status === 401)) {
                this.securityManager.handleTokenExpired();
            }
        }
    }

    extractData(response, dataKey) {
        if (Array.isArray(response)) {
            return response;
        }

        // Mapeo de claves específicas
        const keyMap = {
            productos: ['productos', 'data'],
            usuarios: ['usuarios', 'data'],
            reserva: ['reserva', 'data'],
            tickets: ['tickets', 'data']
        };

        const possibleKeys = keyMap[dataKey] || [dataKey];

        for (const key of possibleKeys) {
            if (response[key] && Array.isArray(response[key])) {
                return response[key];
            }
        }

        return [];
    }
}

// Instancia global del metrics manager
const metricsManager = new MetricsManager();

// ========================================
// CLASE EDIT FORM MANAGER (MANTENIDA)
// ========================================

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
            isCreate = false
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
        if (cancelButton) {
            cancelButton.addEventListener("click", () => {
                this.hideEditCard(config.cardId);
                this.currentEditingId = null;
                if (config.isCreate) {
                    const form = document.getElementById(formId);
                    if (form) form.reset();
                }
            });
        }
    }

    initializeEventListeners() {
        document.addEventListener("click", async (e) => {
            // Manejo de botones de editar/agregar
            for (const [formId, config] of this.configs) {
                if (e.target.classList.contains(config.editButtonClass)) {
                    if (config.isCreate) {
                        await this.handleCreateClick(formId);
                    } else {
                        await this.handleEditClick(formId, e.target);
                    }
                    break;
                }
            }

            // Manejo específico de botones por ID
            if (e.target.matches("#btnAgregarProducto") || e.target.closest("#btnAgregarProducto")) {
                await this.handleCreateClick("formAgregarProducto");
            }

            if (e.target.matches("#btnAgregarEmpleado") || e.target.closest("#btnAgregarEmpleado")) {
                await this.handleCreateClick("formAgregarEmpleado");
            }

            // Manejo de botones de activar/desactivar productos
            if (e.target.classList.contains("btn-desactivar-producto")) {
                await this.handleToggleProducto(e.target, false);
            } else if (e.target.classList.contains("btn-activar-producto")) {
                await this.handleToggleProducto(e.target, true);
            }

            // Manejo de botón eliminar usuario
            if (e.target.classList.contains("btn-eliminar-usuario")) {
                await this.handleDeleteUser(e.target);
            }
        });
    }

    async handleCreateClick(formId) {
        const config = this.configs.get(formId);
        if (!config) return;

        const form = document.getElementById(formId);
        if (form) form.reset();

        this.currentEditingId = null;
        this.showEditCard(config.cardId);

        if (formId === "formAgregarProducto") {
            await cargarProductos();
        }
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
                headers: { "Authorization": `Bearer ${token}` }
            });

            this.populateForm(formId, data, config.fieldsMapping);
            this.showEditCard(config.cardId);
        } catch (error) {
            config.onError(`Error al cargar datos: ${error.message}`);
        }
    }

    async handleToggleProducto(button, activar) {
        const id = button.getAttribute("data-id");
        const titulo = button.getAttribute("data-titulo");
        const accion = activar ? "activar" : "desactivar";

        if (confirm(`¿Está seguro de que desea ${accion} el producto "${titulo}"?`)) {
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

                await cargarProductos();
                console.log(`Producto ${activar ? 'activado' : 'desactivado'} exitosamente`);
            } catch (error) {
                console.error(`Error al ${accion} producto:`, error);
                alert(`Error al ${accion} producto: ${error.message}`);
            }
        }
    }

    async handleDeleteUser(button) {
        const id = button.getAttribute("data-id");
        const nombre = button.getAttribute("data-nombre");

        if (confirm(`¿Estás seguro que querés eliminar al usuario "${nombre}"?`)) {
            try {
                const token = localStorage.getItem("token");
                await apiClient.fetchAPI(`usuarios/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                console.log("Usuario eliminado correctamente");
                await cargarEmpleados();
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                alert(`Error al eliminar usuario: ${error.message}`);
            }
        }
    }

    populateForm(formId, data, fieldsMapping) {
        let flatData = data;

        if (data && typeof data === "object" && !Array.isArray(data) &&
            Object.keys(data).length === 1 && typeof Object.values(data)[0] === "object") {
            flatData = Object.values(data)[0];
        }

        Object.entries(fieldsMapping).forEach(([fieldId, dataKey]) => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.tagName === "SELECT") {
                    field.value = String(flatData[dataKey] ?? "");
                } else {
                    field.value = flatData[dataKey] ?? "";
                }
            }
        });
    }

    async handleFormSubmit(formId, event) {
        const config = this.configs.get(formId);
        if (!config) return;

        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData);

        const apiData = {};
        Object.entries(config.fieldsMapping).forEach(([htmlFieldId, apiFieldName]) => {
            const value = formValues[htmlFieldId];
            if (value !== undefined && value !== "") {
                apiData[apiFieldName] = value;
            }
        });

        // Conversión de tipos
        if (apiData.capacidad !== undefined) apiData.capacidad = Number(apiData.capacidad);
        if (apiData.precio_hora !== undefined) apiData.precio_hora = Number(apiData.precio_hora);
        if (apiData.activo !== undefined) apiData.activo = apiData.activo === "true";

        // Validación para productos
        if (formId === "formAgregarProducto") {
            if (!apiData.tipo_producto_id || isNaN(apiData.tipo_producto_id)) {
                alert("Debe seleccionar un tipo de producto válido");
                return;
            }
        }

        try {
            const token = localStorage.getItem("token");
            let response;

            if (config.isCreate) {
                response = await apiClient.fetchAPI(config.apiEndpoint, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(apiData)
                });
            } else {
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

            this.hideEditCard(config.cardId);
            this.currentEditingId = null;

            if (config.isCreate) {
                const form = document.getElementById(formId);
                if (form) form.reset();
            }

            config.onSuccess();
            config.reloadFunction();
        } catch (error) {
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

// ========================================
// INICIALIZACIÓN
// ========================================

// Instanciar el edit form manager
const editFormManager = new EditFormManager();

// Configuración de formularios (mantenida igual)
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
        onSuccess: () => console.log("Usuario actualizado exitosamente"),
        onError: (error) => {
            console.error("Error al actualizar usuario:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => cargarEmpleados()
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
        onSuccess: () => console.log("Producto actualizado exitosamente"),
        onError: (error) => {
            console.error("Error al actualizar producto:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => cargarProductos()
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
        isCreate: true,
        onSuccess: () => console.log("Producto agregado exitosamente"),
        onError: (error) => {
            console.error("Error al agregar producto:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => cargarProductos()
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
        isCreate: true,
        onSuccess: () => console.log("Empleado agregado exitosamente"),
        onError: (error) => {
            console.error("Error al agregar empleado:", error);
            alert(`Error: ${error}`);
        },
        reloadFunction: () => cargarEmpleados()
    }
];

// Registrar formularios
formsConfig.forEach(config => {
    editFormManager.registerEditForm(config);
});

// ========================================
// EVENT LISTENERS
// ========================================

// Inicializar cuando cargue la página
window.addEventListener('load', async function () {
    await Promise.all([
        cargarEmpleados(),
        cargarProductos(),
        cargarReservas(),
        cargarTickets(),
        metricsManager.updateDashboardMetrics()
    ]);

    setupAgregarProductoButton();
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.clear();
    window.location.href = 'login-admin.html';
});

// Filtros para productos
document.getElementById('btnFiltrarTipo')?.addEventListener('click', async () => {
    const tipo = document.getElementById('inputFiltrarTipo').value;
    if (tipo && !isNaN(tipo)) {
        await cargarProductos(parseInt(tipo));
    } else {
        alert("Por favor ingrese un número válido para el tipo de producto");
    }
});

document.getElementById('btnResetFiltro')?.addEventListener('click', async () => {
    document.getElementById('inputFiltrarTipo').value = '';
    await cargarProductos();
});

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function setupAgregarProductoButton() {
    const btnAgregar = document.getElementById("btnAgregarProducto");
    if (btnAgregar) {
        // El botón ya está manejado por el EditFormManager
        // Solo necesitamos asegurar que esté visible y funcional
        btnAgregar.style.display = "block";

        // Agregar evento click si no existe (redundancia preventiva)
        btnAgregar.addEventListener("click", async function () {
            await editFormManager.handleCreateClick("formAgregarProducto");
        });
    }
}


