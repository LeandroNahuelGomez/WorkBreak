/**
 * Middleware de autenticación que verifica tokens JWT
 * @module authMiddleware
 */

const jwt = require('jsonwebtoken');
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
// Importa y inicializa el modelo de Usuario
const Usuario = require("../models/usuario.model")(sequelize, DataTypes);

/**
 * Middleware que verifica la autenticación mediante JWT
 * @function checkAuth
 * @async
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>} No devuelve un valor directamente, pero:
 *   - Si la autenticación falla, envía una respuesta de error
 *   - Si tiene éxito, adjunta el usuario a la solicitud y llama a next()
 */

const checkAuth = async (req, res, next) => {
  // console.log("[checkAuth] Token recibido:", req.headers.authorization);
  try {
    // Paso 1: Extraer el token del header Authorization
    // El formato esperado es: "Bearer <token>"
    //Ese ?. se llama "Optional chaining" (encadenamiento opcional). Permite acceder a una propiedad solo si existe. Si authorization no está definido, en lugar de tirar un error, devuelve undefined.
    const token = req.headers.authorization?.split(' ')[1];

    // Paso 2: Verificar si el token existe
    if (!token) {
      return res.status(401).json({
        error: 'Acceso no autorizado',
        details: "Token no proporcionado en el encabezado Authorization",
        code: "MISSING_TOKEN"
      });
    }
    // Paso 3: Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Paso 4: Buscar el usuario en la base de datos usando el ID del token
    const user = await Usuario.findByPk(decoded.id);

    // Paso 5: Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({
        error: 'Usuario no válido',
        details: "El usuario asociado el token no existe en la base de datos"
      });
    }

    // Paso 6: Adjuntar el usuario a la solicitud para uso en rutas posteriores
    req.user = user;

    // Paso 7: Pasar al siguiente middleware o controlador de ruta
    next();
  } catch (error) {
    // Manejo de errores
    let errorMessage = 'Token inválido o expirado';
    let statusCode = 401;

    // Mensajes más específicos según el tipo de error
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'Token expirado';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = 'Token inválido';
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: error.message
    });
  }
};

const checkRole = (allowedRoles) => (req, res, next) => {
  // console.log("[checkRole] Roles permitidos:", allowedRoles, "Rol usuario:", req.user?.rol_id);
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    // Convierte a array si es un solo rol
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(req.user.rol_id)) {
      return res.status(403).json({
        success: false,
        error: 'Acceso prohibido - Rol insuficiente',
        code: 'INSUFFICIENT_ROLE',
        requiredRoles: roles,
        userRole: req.user.rol_id
      });
    }

    next();
  } catch (error) {
    console.error('Error en checkRole:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      code: 'SERVER_ERROR'
    });
  }
};

module.exports = { checkAuth, checkRole };