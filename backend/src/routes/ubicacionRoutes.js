const express = require("express");
const router = express.Router();
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');

const { obtenerUbicacionPorId, obtenerUbicaciones, crearUbicacion, actualizarUbicacion, eliminarUbicacion} = require("../controllers/ubicacionController");

router.get("/", obtenerUbicaciones);
router.get("/:id", obtenerUbicacionPorId);
router.post("/", checkAuth, checkRole([1,2]),crearUbicacion);
router.put("/:id", checkAuth, checkRole([1,2]),actualizarUbicacion);      
router.delete("/:id",checkAuth, checkRole([1,2]),eliminarUbicacion);      

module.exports = router;