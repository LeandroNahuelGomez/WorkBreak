<div align="center">
  <img src="frontend/img/Logo_Workbreak (1).ico" width="120"/>
</div>

<h1 align="center">🚀 WorkBreak – Terminal de Autoservicio para Reservas Temporales</h1>

<h3 align="center">Desarrollado por: Leandro Nahuel Gómez</h3>
<p align="center">
  💻 Trabajo Integrador Final · 🏫 UTN Avellaneda · 🗓️ Año 2025
</p>

---

<p align="center">
  🌟 <strong>WorkBreak</strong> es una solución digital de autoservicio para reservar espacios temporales de forma simple, rápida y sin intermediarios.<br/>
  Ideal para oficinas, coworkings, universidades o centros de relax. Inspirado en kioscos digitales modernos como los de aeropuertos o McDonald's, pero orientado a espacios de uso por hora o día.
</p>

---

## 🎯 ¿Qué se puede reservar?

WorkBreak ofrece **dos grandes categorías de espacios**:

### 🧑‍💻 Espacios de Trabajo
- Coworking moderno
- Salas de reuniones
- Cabinas de concentración
- Escritorios individuales
- Salas privadas de videollamadas
- Estaciones con PC para diseño o edición
- Workcafés con café incluido

### 🧘 Espacios de Relax / Reunión
- Salas de meditación o mindfulness
- Mini salas de cine
- Salas de lectura
- Espacios gamer (consolas, sillones)
- Cabinas musicales insonorizadas
- Salas de karaoke privadas
- Cabinas de masajes automáticos

> Cada espacio tiene variantes de **ubicación**, **comodidades**, **capacidad** y **precio por hora**.

---

## 🧠 ¿Por qué es innovador?

| Característica                        | ✔ Cumple |
|--------------------------------------|:--------:|
| 2 tipos de productos                 | ✅        |
| Variantes dentro de cada tipo       | ✅        |
| Sistema de autoservicio real        | ✅        |
| Navegación clara y responsiva       | ✅        |
| Generación de ticket personalizado  | ✅        |
| Backend con API + Panel Admin       | ✅        |
| No es e-commerce ni vende comida    | ✅        |
| Escalable con nuevas funciones      | ✅        |

---

## 🧾 Flujo del Usuario

### 👤 Cliente:
1. Ingresa su nombre
2. Elige una categoría (trabajo o relax)
3. Filtra espacios según ubicación, precio, capacidad
4. Selecciona espacio y duración de reserva
5. Confirma reserva
6. Obtiene un **ticket PDF** con todos los datos
7. Reinicia la experiencia si lo desea

### 🔐 Administrador:
1. Inicia sesión segura
2. Visualiza panel de control con listado de espacios
3. Agrega nuevos espacios con imágenes y datos
4. Modifica o desactiva espacios existentes
5. Administra la base de datos desde el dashboard

---

## 🛠️ Tecnologías Utilizadas

| Área             | Tecnologías                                     |
|------------------|--------------------------------------------------|
| 🧑‍🎨 Frontend      | HTML, CSS, JavaScript (ES6+), Bootstrap         |
| ⚙️ Backend        | Node.js, Express.js, EJS, Sequelize ORM         |
| 🗃️ Base de datos  | MySQL / SQLite                                  |
| 🔒 Seguridad      | Bcrypt, dotenv, middlewares, validaciones Joi   |
| 🧾 Otros          | Multer (carga de imágenes), PDF Generator       |

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,nodejs,express,html,css,mysql,git,github" />
  </a>
</p>

---

## 🧱 Estructura del Proyecto

```bash
WorkBreak/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración del servidor
│   │   ├── controllers/    # Lógica del negocio
│   │   ├── middlewares/    # Autenticación y validaciones
│   │   ├── models/         # Modelos Sequelize
│   │   ├── routes/         # Endpoints de la API
│   │   └── schemas/        # Validaciones Joi
│   └── index.js            # Servidor principal Express
│
├── frontend/
│   ├── pages/              # Páginas HTML (cliente y admin)
│   ├── js/                 # Lógica JavaScript (DOM + Fetch)
│   ├── styles/             # Estilos CSS (modo claro/oscuro)
│   └── img/                # Imágenes, íconos y favicons
```

---

## 🧩 Funcionalidades Clave

### Cliente
- 🛠️ Interfaz responsiva
- 📍 Selector por tipo, ubicación y espacio
- 🕒 Definición de duración
- 📄 Ticket con detalles (espacio, hora, precio)
- 🌗 Modo oscuro con persistencia
- 📥 Descarga de ticket en PDF

### Administrador
- 🔐 Login seguro
- 📋 CRUD completo de espacios
- ✏️ Edición de espacios activos/inactivos
- 🧾 Visualización de reservas (opcional)

---

## 🧪 Seguridad y Validaciones

- 🔒 Hash de contraseñas con `bcrypt`
- 🧱 Middleware de autenticación y rutas protegidas
- 🧼 Validaciones robustas con `Joi`
- ✅ Productos inactivos ocultos en el frontend
- 🚫 Sanitización y control en formularios

---

<img align="right" alt="Coding" width="300" src="https://user-images.githubusercontent.com/74038190/229223263-cf2e4b07-2615-4f87-9c38-e37600f8381a.gif">

## 🎓 Información Académica

Este proyecto fue desarrollado como **Trabajo Integrador Final** para la asignatura **Programación III** en el **Tercer Cuatrimestre** de la carrera **Tecnicatura en Programación - UTN FRA**.

Evaluado por:
- ✔️ Implementación del paradigma MVC
- ✔️ Lógica de backend robusta con API REST
- ✔️ Panel de administración funcional
- ✔️ Interfaz amigable y navegación intuitiva
- ✔️ Uso realista de conceptos como roles, validaciones, archivos, persistencia

---

## 💡 Lo que aprendí

> Este proyecto fue una experiencia completa. No solo afiancé conocimientos técnicos, sino que aprendí a planificar, construir y mantener una aplicación de principio a fin, con visión profesional.

- 🔄 Separación de responsabilidades (MVC)
- 🔗 Comunicación Frontend ↔ Backend
- 🌐 Gestión de estado en el cliente
- 🧰 Reutilización de componentes y modularidad
- 📊 Modelado de base de datos relacional
- 🧠 Pensamiento crítico y experiencia de usuario
- 🕹️ Simulación de uso real en entornos públicos

---

> Este proyecto es solo el **punto de partida**. Estoy abierto a sugerencias, recomendaciones y críticas constructivas para seguir creciendo como desarrollador.

---

## 📫 Contacto

- 📧 lean.nahu.gomez@gmail.com  
- 💼 [LinkedIn](https://www.linkedin.com/in/leandronahuelgomez/)  
- 🧠 Portafolio y proyectos: [GitHub](https://github.com/LeandroNahuelGomez)

---

> _“Construir no es solo programar. Es entender un problema, imaginar una solución útil y hacerla realidad con disciplina, constancia y pasión.”_


