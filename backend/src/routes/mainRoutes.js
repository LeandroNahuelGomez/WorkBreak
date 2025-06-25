const express = require("express");
const router = express.Router();

// Rutas organizadas por dominio
const authRoutes = require("./authRoutes");
const usuarioRoutes = require("./usuarioRoutes");
const productoRoutes = require("./productoRoutes");
const atributoProductoRoutes = require("./atributoProductoRoutes");
const { checkAuth } = require("../middlewares/authMiddleware");

// Prefijo de versión (convención RESTful)
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/usuarios", usuarioRoutes);
router.use("/api/v1/productos", productoRoutes);
router.use("/api/v1/atributo-producto", atributoProductoRoutes);

module.exports = router;
