const express = require("express");
const router = express.Router();

const { obtenerAtributosProducto, crearAtributoProducto, actualizarAtributoProducto, eliminarAtributoProducto } = require("../controllers/atributoProductoController");
const { checkAuth, checkRole } = require("../middlewares/authMiddleware");

router.get("/", obtenerAtributosProducto);
router.post("/", checkAuth, checkRole([1,2]), crearAtributoProducto);
router.put("/:id",checkAuth, checkRole([1,2]), actualizarAtributoProducto);         
router.delete("/:id",checkAuth, checkRole([1,2]), eliminarAtributoProducto)

module.exports = router;