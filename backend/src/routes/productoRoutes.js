const express = require("express");
const router = express.Router();

const { obtenerProducto } = require("../controllers/productoController");

router.get("/", obtenerProducto);


module.exports = router;