const express = require("express");
const router = express.Router();

const { obtenerTiposProductos, obtenerTipoProductoPorId ,crearTipoProducto, actualizarTipoProducto, eliminarTipoProducto} = require("../controllers/tipoProductoController");

router.get("/", obtenerTiposProductos);
router.get("/:id", obtenerTipoProductoPorId);
router.post("/", crearTipoProducto);
router.put("/:id", actualizarTipoProducto);      
router.delete("/:id", eliminarTipoProducto);      

module.exports = router;