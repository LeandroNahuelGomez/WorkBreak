const express = require("express");
const router = express.Router();

const { obtenerProducto, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto} = require("../controllers/productoController");

router.get("/", obtenerProducto);
router.get("/:id", obtenerProductoPorId);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);      
router.delete("/:id", eliminarProducto);      


module.exports = router;