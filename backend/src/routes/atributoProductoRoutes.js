const express = require("express");
const router = express.Router();

const { obtenerAtributosProducto, crearAtributoProducto, actualizarAtributoProducto } = require("../controllers/atributoProductoController");

router.get("/", obtenerAtributosProducto);
router.post("/", crearAtributoProducto);
router.put("/:id", actualizarAtributoProducto);         


module.exports = router;