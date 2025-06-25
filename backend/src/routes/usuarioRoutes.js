const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id',  usuarioController.eliminarUsuario);

module.exports = router;