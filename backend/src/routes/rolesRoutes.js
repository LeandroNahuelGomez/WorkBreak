const express = require("express");
const router = express.Router();
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');


const { obtenerRoles, obtenerRolPorId, actualizarRol, eliminarRol, crearRol} = require("../controllers/rolesController");

router.get("/", checkAuth, checkRole(1), obtenerRoles);
router.get("/:id", checkAuth, checkRole([1,2,3]), obtenerRolPorId);
router.post("/", checkAuth, checkRole(1), crearRol);
router.put("/:id",checkAuth, checkRole(1), actualizarRol);      
router.delete("/:id",checkAuth, checkRole(1), eliminarRol);      

module.exports = router;