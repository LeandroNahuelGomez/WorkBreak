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
router.get("/usuarios", obtenerUsuarios);             // GET todos
router.get("/usuarios/:id", obtenerUsuarioPorId);     // GET uno por ID
router.post("/usuarios", crearUsuario);               // POST (crear)
router.put("/usuarios/:id", actualizarUsuario);       // PUT (editar)
router.delete("/usuarios/:id", eliminarUsuario);      // DELETE (eliminar)

module.exports = router;