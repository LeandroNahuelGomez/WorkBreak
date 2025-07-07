const express = require("express");
const router = express.Router();

// Rutas organizadas por dominio
const authRoutes = require("./authRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const productoRoutes = require("./productoRoutes");
const atributoProductoRoutes = require("./atributoProductoRoutes");
const ubicacionRoutes = require("./ubicacionRoutes");
const ticketRoutes = require("./ticketRoutes");
const rolesRoutes = require("./rolesRoutes");
const tipoProductoRoutes = require("./tipoProductosRoutes");
const reservaRoutes = require("./reservaRoutes");
const { checkAuth } = require("../middlewares/authMiddleware");

// Prefijo de versión (convención RESTful)
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/usuarios", usuarioRoutes);
router.use("/api/v1/productos", productoRoutes);
router.use("/api/v1/atributo-producto", atributoProductoRoutes);
router.use("/api/v1/ubicacion", ubicacionRoutes);
router.use("/api/v1/ticket", ticketRoutes);
router.use("/api/v1/roles", rolesRoutes);
router.use("/api/v1/tipos-producto", tipoProductoRoutes);
router.use("/api/v1/reserva", reservaRoutes);

module.exports = router;
