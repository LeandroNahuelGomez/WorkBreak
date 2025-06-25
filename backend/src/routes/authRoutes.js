const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSchema, loginRateLimiter } = require('../middlewares/validators');
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');
const { loginSchema, registerSchema } = require('../schemas/authSchemas');

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
  '/login-admin',
  loginRateLimiter,
  validateSchema(loginSchema),
  authController.loginEmpleado
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
  validateSchema(registerSchema),
  authController.register
);


module.exports = router;