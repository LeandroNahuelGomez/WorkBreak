const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSchema, loginRateLimiter } = require('../middlewares/validators');
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');
const {loginEmpleadoSchema, loginAdminSchema, registerSchema } = require('../schemas/authSchemas');

/**
 * @swagger
 * /auth/login-admin:
 *   post:
 *     summary: Inicio de sesión para administradores
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 *       429:
 *         description: Demasiados intentos
 */
router.post(
  '/login-empleado',
  loginRateLimiter,
  validateSchema(loginEmpleadoSchema),
  authController.loginEmpleado
);

router.post(
  '/login-admin',
  loginRateLimiter,
  validateSchema(loginAdminSchema),
  authController.loginAdmin
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de nuevos usuarios
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El email ya está registrado
 */
router.post(
  '/register',
  loginRateLimiter,
  validateSchema(registerSchema),
  authController.register
);


router.post(
  '/logout',
  checkAuth,
  (req, res) => {
    res.json({
      success: true,
      message: 'Logout exitoso. Elimina el token del cliente.'
    });
  }
);

module.exports = router;