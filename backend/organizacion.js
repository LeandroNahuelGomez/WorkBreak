// ESTRUCTURA BASE COMPLETA PARA SISTEMA DE AUTENTICACIÓN Y USUARIOS CON JWT + ZOD + EXPRESS

// ===============================
// 📁 models/usuario.model.js
// ===============================

// module.exports = (sequelize, DataTypes) => {
//   const Usuario = sequelize.define("usuarios", {
//     usuario_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     rol_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     nombre: {
//       type: DataTypes.STRING(100),
//       allowNull: false
//     },
//     apellido: {
//       type: DataTypes.STRING(100),
//       allowNull: false
//     },
//     email: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//       unique: true
//     },
//     contrasena_hash: {
//       type: DataTypes.STRING(255),
//       allowNull: false
//     },
//     rol: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       defaultValue: 'user'
//     },
//     telefono: DataTypes.STRING(20),
//     avatar_url: DataTypes.STRING(255),
//     verificado: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     fecha_registro: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW
//     }
//   }, {
//     tableName: "usuarios",
//     timestamps: false
//   });

//   return Usuario;
// };

// ===============================
// 📁 controllers/authController.js
// ===============================

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/db.config");
// const Usuario = require("../models/usuario.model")(sequelize, DataTypes);

// const generarToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await Usuario.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

//     const isValid = await bcrypt.compare(password, user.contrasena_hash);
//     if (!isValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

//     const token = generarToken(user.usuario_id);
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Error en el servidor' });
//   }
// };

// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Usuario.findOne({ where: { email, rol: 'admin' } });
//     if (!admin) return res.status(404).json({ error: 'Admin no encontrado' });

//     const isValid = await bcrypt.compare(password, admin.contrasena_hash);
//     if (!isValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

//     const token = generarToken(admin.usuario_id);
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ error: 'Error en el servidor' });
//   }
// };

// const register = async (req, res) => {
//   try {
//     const { email, password, nombre, apellido, rol_id, rol } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await Usuario.create({
//       email,
//       contrasena_hash: hashedPassword,
//       nombre,
//       apellido,
//       rol_id,
//       rol
//     });

//     const token = generarToken(user.usuario_id);
//     res.status(201).json({ user, token });
//   } catch (error) {
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(400).json({ error: 'El email ya está registrado' });
//     }
//     res.status(500).json({ error: 'Error al registrar usuario' });
//   }
// };

// module.exports = { loginUser, loginAdmin, register };

// ===============================
// 📁 controllers/usuarioController.js
// ===============================

// const { DataTypes, Op } = require("sequelize");
// const { sequelize } = require("../config/db.config");
// const Usuario = require("../models/usuario.model")(sequelize, DataTypes);

// const obtenerUsuarios = async (req, res) => {
//   try {
//     const usuarios = await Usuario.findAll();
//     res.json(usuarios);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
//   }
// };

// const obtenerUsuarioPorId = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const usuario = await Usuario.findByPk(id);
//     if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
//     res.json(usuario);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al buscar usuario', detalle: error.message });
//   }
// };

// const actualizarUsuario = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const usuario = await Usuario.findByPk(id);
//     if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

//     await usuario.update(req.body);
//     res.json(usuario);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
//   }
// };

// const eliminarUsuario = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const usuario = await Usuario.findByPk(id);
//     if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

//     await usuario.destroy();
//     res.json({ mensaje: 'Usuario eliminado' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
//   }
// };

// module.exports = {
//   obtenerUsuarios,
//   obtenerUsuarioPorId,
//   actualizarUsuario,
//   eliminarUsuario
// };

// ===============================
// 📁 middlewares/authMiddleware.js
// ===============================

// const jwt = require('jsonwebtoken');
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/db.config");
// const Usuario = require("../models/usuario.model")(sequelize, DataTypes);

// const checkAuth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await Usuario.findByPk(decoded.id);
//     if (!user) return res.status(401).json({ error: 'Usuario no válido' });

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Token inválido o expirado' });
//   }
// };

// const checkRole = (role) => (req, res, next) => {
//   if (req.user?.rol !== role) {
//     return res.status(403).json({ error: 'Acceso prohibido' });
//   }
//   next();
// };

// module.exports = { checkAuth, checkRole };

// ===============================
// 📁 middlewares/validators.js
// ===============================

// const rateLimiter = require('express-rate-limit');
// const { z } = require('zod');

// const validateSchema = (schema) => (req, res, next) => {
//   try {
//     schema.parse(req.body);
//     next();
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       message: 'Datos inválidos',
//       error: error.errors
//     });
//   }
// };

// const loginRateLimiter = rateLimiter({
//   windowMs: 15 * 60 * 1000,
//   max: 10,
//   message: { status: 'error', message: 'Demasiados intentos de login. Intente más tarde.' }
// });

// module.exports = {
//   validateSchema,
//   loginRateLimiter
// };

// ===============================
// 📁 routes/authRoutes.js
// ===============================

// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { validateSchema, loginRateLimiter } = require('../middlewares/validators');
// const { checkAuth, checkRole } = require('../middlewares/authMiddleware');

// // Zod schemas (pueden estar en carpeta /schemas si lo preferís)
// const { z } = require('zod');
// const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
// const registerSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   nombre: z.string().min(2),
//   apellido: z.string().min(2),
//   rol_id: z.number(),
//   rol: z.enum(['user', 'admin'])
// });



// router.post(
//   '/login-user',
//   loginRateLimiter,
//   validateSchema(loginSchema),
//   authController.loginUser
// );

// router.post(
//   '/login-admin',
//   loginRateLimiter,
//   validateSchema(loginSchema),
//   authController.loginAdmin
// );

// router.post(
//   '/register',
//   validateSchema(registerSchema),
//   authController.register
// );

// router.get(
//   '/profile',
//   checkAuth,
//   checkRole('user'),
//   (req, res) => res.json({ user: req.user })
// );

// module.exports = router;

// ===============================
// 📁 routes/usuarioRoutes.js
// ===============================

// const express = require('express');
// const router = express.Router();
// const usuarioController = require('../controllers/usuarioController');
// const { checkAuth, checkRole } = require('../middlewares/authMiddleware');

// router.get('/', checkAuth, checkRole('admin'), usuarioController.obtenerUsuarios);
// router.get('/:id', checkAuth, usuarioController.obtenerUsuarioPorId);
// router.put('/:id', checkAuth, usuarioController.actualizarUsuario);
// router.delete('/:id', checkAuth, checkRole('admin'), usuarioController.eliminarUsuario);

// module.exports = router;
