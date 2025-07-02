const express = require("express");
const router = express.Router();
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');

const { obtenerProductos, obtenerProductoPorId, crearProducto, actualizarProducto, eliminarProducto} = require("../controllers/productoController");

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.post("/", checkAuth, checkRole([1, 2]), crearProducto);
router.put("/:id", checkAuth, checkRole([1, 2]), actualizarProducto);   
router.delete("/:id",checkAuth, checkRole([1,2]), eliminarProducto);    

module.exports = router;