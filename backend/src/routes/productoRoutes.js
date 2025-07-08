const express = require("express");
const router = express.Router();
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');
// const upload = require('../middlewares/upload'); // <--- Aca importás multer

const { obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto } = require("../controllers/productoController");

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);

router.post("/",
    checkAuth,
    checkRole(1),
    // upload.single('imagen'), // <--- Aca usás multer para subir una imagen    
    crearProducto);

router.put("/:id",
    checkAuth,
    checkRole(1),
    // upload.single("imagen"), // <-- si querés permitir cambiar imagen también
    actualizarProducto);

router.delete("/:id", checkAuth, checkRole(1), eliminarProducto);

module.exports = router;