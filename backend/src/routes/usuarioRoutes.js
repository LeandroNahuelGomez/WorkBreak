const express = require("express");
const router = express.Router();

// Importo funciones del controlador
const {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} = require("../controllers/usuarioController.js"); 

// Rutas RESTful
router.get("/", obtenerUsuarios);             // GET todos
router.get("/:id", obtenerUsuarioPorId);     // GET uno por ID
router.post("/", crearUsuario);               // POST (crear)
router.put("/:id", actualizarUsuario);       // PUT (editar)
router.delete("/:id", eliminarUsuario);      // DELETE (eliminar)

module.exports = router;