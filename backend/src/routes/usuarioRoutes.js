const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');

router.get('/', checkAuth, checkRole(1), usuarioController.obtenerUsuarios);
router.get('/:id',checkAuth, checkRole(1), usuarioController.obtenerUsuarioPorId);
router.put('/:id', checkAuth, checkRole(1), usuarioController.actualizarUsuario);
router.delete('/:id',checkAuth, checkRole(1),usuarioController.eliminarUsuario);
router.get('/mi-perfil', 
  checkRole([1, 2]), // Admins (1) y Proveedores (2)
  (req, res) => {
    res.json({
      success: true,
      data: {
        id: req.user.usuario_id,
        email: req.user.email,
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        rol_id: req.user.rol_id
      }
    });
  }
);

module.exports = router;