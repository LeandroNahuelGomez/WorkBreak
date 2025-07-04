<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" width="120"/>
</p>

<h1 align="center">🚀 WorkBreak - Sistema de Autoservicio Digital</h1>

<p align="center">
  <strong>Leandro Nahiel Gómez</strong> & <strong>Lorenzo Gómez Martins</strong><br/>
  💻 Trabajo Integrador Final | 🏫 UTN Avellaneda | 🗓️ Año 2025
</p>

---

## 🎯 ¿Qué es *WorkBreak*?

**WorkBreak** es una aplicación web **responsive** de autoservicio para la compra de productos digitales (🎧 _Licencias de software_ y 📚 _E-books_). Está dividida en dos partes principales:

- 🧑‍💻 **Frontend (Cliente)**: permite al usuario comprar productos fácilmente y generar un **ticket** con su compra.
- 🛠️ **Backend (Admin)**: incluye una **API REST** y un **panel BackOffice** para administrar productos.

---

## 🧱 Estructura del Proyecto
WorkBreak/
├── backend/
│ ├── src/
│ │ ├── config/ ← Configuración del servidor
│ │ ├── controllers/ ← Lógica de control
│ │ ├── middlewares/ ← Validaciones y seguridad
│ │ ├── models/ ← Definición de modelos Sequelize
│ │ ├── routes/ ← Rutas de la API
│ │ └── schemas/ ← Validaciones con Joi
│ ├── db/ ← Base de datos
│ └── index.js ← Servidor principal
│
├── frontend/
│ ├── pages/ ← Archivos HTML del cliente y admin
│ ├── js/ ← Lógica JS (fetch, DOM)
│ ├── styles/ ← Estilos CSS
│ └── img/ ← Imágenes y favicons


---

## 🌐 Tecnologías Utilizadas

| Área | Tecnologías |
|------|-------------|
| 🧑‍🎨 Frontend | HTML5, CSS3, JavaScript ES6+, Bootstrap, Fetch API |
| ⚙️ Backend | Node.js, Express.js, EJS, Sequelize ORM |
| 🛢️ Base de datos | MySQL / SQLite (según entorno) |
| 🧪 Validaciones | Joi, Middlewares personalizados |
| 📦 Otros | Multer (carga de imágenes), dotenv |

---

## 🧑‍💻 Funcionalidades Principales

### 👥 Cliente

- ✅ Pantalla de bienvenida con ingreso de nombre.
- 🛍️ Vista de productos (2 categorías).
- 🛒 Carrito dinámico: agregar, quitar y modificar cantidades.
- 📄 Ticket final con nombre, fecha, total y productos.
- 📥 Descargar ticket como PDF.
- ☀️/🌙 Modo claro y oscuro con persistencia.
- 🔁 Botón de reinicio del proceso de compra.
- 🔗 Acceso al login de administrador.

### 🧑‍🏫 Administrador

- 🔐 Login con correo y contraseña.
- ⚡ Acceso rápido (autocompleta los campos).
- 📋 Dashboard con productos divididos por categoría.
- ➕ Alta de producto (con imagen).
- ✏️ Modificación total del producto.
- 🗑️ Baja lógica (no se elimina, se desactiva).
- ✅ Activación de productos inactivos.

---

## 🧭 Navegación del Sitio

### Cliente:
| Página | Descripción |
|--------|-------------|
| `bienvenido.html` | Ingreso de nombre |
| `index.html` | Visualización de productos |
| `carrito.html` | Vista y edición del carrito |
| `detalle.html` | Ticket final de compra |

### Admin:
| Página | Descripción |
|--------|-------------|
| `login-admin.html` | Login del administrador |
| `dashboard-admin.html` | Panel BackOffice |
| `dashboard-user.html` | Panel de cliente para testing |
| `register-user.html` | Registro (opcional) |

---

## 🗂️ Base de Datos

- **Usuarios**  
  `id`, `nombre`, `email`, `passwordHash`, `rol`

- **Productos**  
  `id`, `nombre`, `descripcion`, `precio`, `imagen`, `tipo`, `activo`

- **Ventas**  
  `id`, `nombreUsuario`, `productos[]`, `total`, `fecha`

---

## 🔁 Flujo de Usuario

### 🛍️ Cliente

1. Ingresa nombre.
2. Navega entre categorías.
3. Agrega/quita productos.
4. Ajusta cantidades.
5. Confirma compra.
6. Visualiza ticket + descarga PDF.
7. Reinicia todo.

### 🛠️ Administrador

1. Ingresa usuario/contraseña.
2. Accede al dashboard.
3. Agrega/modifica productos.
4. Activa/inactiva productos.
5. Vuelve al dashboard.

---

## 🔐 Seguridad y Validaciones

- 🧱 Middleware de autenticación
- 🧼 Validaciones con Joi
- 🔒 Hash de contraseñas
- 🚫 Productos inactivos ocultos al cliente
- 🧪 Validación en inputs de formularios

---

## ✨ Extras Destacados

- 🎨 Tema oscuro persistente
- 🧾 Descarga de ticket en PDF
- ✅ Acceso rápido para pruebas
- 🧼 Carrito limpio tras co

