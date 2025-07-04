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

WorkBreak es una aplicación web responsive que combina lo mejor de un Airbnb con un marketplace digital. Ofrece un sistema de autoservicio donde los usuarios pueden:
🏨 Reservar alojamientos (hoteles, espacios de coworking, etc.)
🍽️ Elegir entre restaurantes y lugares para comer

📲 Frontend (Cliente)
--Aplicación responsive donde el usuario ingresa su nombre, navega productos por categorías y realiza compras.
--Permite agregar/quitar productos del carrito, cambiar el tema, descargar ticket en PDF y ver solo productos activos.

🧑‍💼 Frontend (Administrador)
--Panel BackOffice con vistas EJS donde el admin inicia sesión, visualiza y gestiona productos.
--Puede agregar, editar, dar de baja o reactivar productos con imágenes y ver su estado (activo/inactivo).

🛠️ Backend
--Servidor en Node.js + Express con estructura MVC, que maneja lógica, base de datos y seguridad.
--Incluye API REST en JSON, ORM, subida de imágenes, validaciones, relaciones entre productos y ventas, y paginación.

## 🧱 Estructura del Proyecto
WorkBreak/
├── backend/
│   ├── src/
│   │   ├── config/         ← Configuración del servidor
│   │   ├── controllers/    ← Lógica de control
│   │   ├── middlewares/    ← Validaciones y seguridad
│   │   ├── models/         ← Definición de modelos Sequelize
│   │   ├── routes/         ← Rutas de la API
│   │   └── schemas/        ← Validaciones con Joi
│   ├── db/                 ← Base de datos
│   └── index.js            ← Servidor principal

├── frontend/
│   ├── pages/              ← Archivos HTML del cliente y admin y Dashboard
│   ├── js/                 ← Lógica JS (fetch, DOM)
│   ├── styles/             ← Estilos CSS
│   └── img/                ← Imágenes y favicons



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
- 🛍️ Vista de productos (2 o más categorías).
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
| `Login-user.html | Ingreso de usuarios con nombre |
| `Dashboard-user.html` | Visualización de productos |
| `carrito.html` | Vista y edición del carrito (entrega de ticket una vez confirmada la compra) |
| `detalle.html` | Informacion más detallada de productos |

### Admin:
| Página | Descripción |
|--------|-------------|
| `login-admin.html` | Login del administrador |
| `dashboard-admin.html` | Panel BackOffice |
| `dashboard-user.html` | Panel de cliente para testing |
| `register-user.html` | Registro (opcional) |

---

🗂️ Base de datos
Usuarios
id, rol_id, nombre, apellido, email, passwordHash, telefono, avatar_url, verificado, fecha_registro

Roles
rol_id, nombre

TipoProducto
tipo_id, nombre, icono_url

Productos
id, tipo_producto_id, titulo, descripcion, capacidad, normas, activo, fecha_creacion

Ubicación
id, producto_id, pais, ciudad, direccion, codigo_postal, latitud, longitud

AtributoProducto
id, producto_id, nombre_atributo, valor, tipo_dato

Reservas
id, producto_id, fecha_inicio, fecha_fin, cantidad_personas, estado, monto_total, metodo_pago_id, fecha_reserva

Tickets
id, reserva_id, codigo_ticket, fecha_emision, estado, qr_url, detalles

Auditoría
id, usuario_id, accion, tabla_afectada, registro_id_afectado, descripcion_cambio, fecha_hora
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

1. Ingresa usuario/apellido/mailcontraseña.
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

