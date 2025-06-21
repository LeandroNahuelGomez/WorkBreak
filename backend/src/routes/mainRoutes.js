const express = require("express");
const router = express.Router();
const productoRoutes = require("./productoRoutes");
const usuarioRoutes = require("./usuarioRoutes");

//Middleware para prefijo de version API
router.use("/api/v1/producto", productoRoutes);
router.use("/api/v1/usuarios", usuarioRoutes);


module.exports = router;