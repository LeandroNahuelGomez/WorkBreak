const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const Usuario = require("../models/usuario.model")(sequelize, DataTypes);

// Costo del hashing - puede ajustarse según necesidades de seguridad/performance
const SALT_ROUNDS = 10;
const TOKEN_EXPIRATION = '1h';
const ROL_PROVEEDOR_ID = 2;

/**
 * Genera un token JWT para un usuario
 * @param {number} userId - ID del usuario
 * @returns {string} Token JWT firmado
 */
const generarToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: TOKEN_EXPIRATION }
  );
};

/**
 * Controlador para el login de administradores
 * @async
 * @function loginAdmin
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} No devuelve un valor directamente, envía una respuesta HTTP
 */
const loginEmpleado = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const isValid = await bcrypt.compare(password, user.contrasena_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta',
        code: 'INVALID_PASSWORD'
      });
    }

    const token = generarToken(user.usuario_id);

    res.json({
      success: true,
      token,
      user: {
        id: user.usuario_id,
        email: user.email,
        rol_id: user.rol_id // El frontend puede usar esto para redirigir
      }
    });
  } catch (error) {
    console.error('Error en loginEmpleado:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: 'SERVER_ERROR'
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    const user = await Usuario.findOne({ where: { nombre, apellido, email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Credenciales inválidas',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const isValid = await bcrypt.compare(password, user.contrasena_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Contraseña incorrecta',
        code: 'INVALID_PASSWORD'
      });
    }

    const token = generarToken(user.usuario_id);

    res.json({
      success: true,
      token,
      user: {
        id: user.usuario_id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol_id: user.rol_id // El frontend puede usar esto para redirigir
      }
    });
  } catch (error) {
    console.error('Error en loginAdmin:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: 'SERVER_ERROR'
    });
  }
};

/**
 * Controlador para registrar nuevos usuarios
 * @async
 * @function register
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} No devuelve un valor directamente, envía una respuesta HTTP
 */
const register = async (req, res) => {
  try {
    const { email, contraseña , nombre, apellido, telefono } = req.body;

    // Verificar si el email ya existe
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado',
        code: 'EMAIL_EXISTS'
      });
    }

    const hashedPassword = await bcrypt.hash(contraseña, SALT_ROUNDS);

    const user = await Usuario.create({
      rol_id: ROL_PROVEEDOR_ID, // Fijado desde backend
      email,
      contrasena_hash: hashedPassword,
      nombre,
      apellido,
      telefono
    });

    const token = generarToken(user.usuario_id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.usuario_id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        rol_id: user.rol_id
      }
    });
  } catch (error) {
    console.error('Error en register:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado',
        code: 'EMAIL_EXISTS'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario',
      code: 'REGISTRATION_ERROR'
    });
  }
};

module.exports = {
  loginEmpleado,
  loginAdmin,
  register
};