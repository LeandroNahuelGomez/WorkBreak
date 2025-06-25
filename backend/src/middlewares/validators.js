/**
 * Módulo de utilidades para validación y limitación de peticiones
 * @module utils/middlewares
 */ 

const rateLimiter = require('express-rate-limit');
const { z } = require('zod');

/**
 * Middleware factory para validar datos de entrada contra un esquema Zod
 * @function validateSchema
 * @param {z.ZodObject} schema - Esquema Zod para validación
 * @returns {Function} Middleware de Express que valida el cuerpo de la petición
 * 
 * @example
 * // Uso:
 * router.post('/login', validateSchema(loginSchema), authController.login);
 */
const validateSchema = (schema) => (req, res, next) => {
  try {
    // Validación estricta que elimina campos no definidos en el esquema
    const validatedData = schema.parse(req.body);
    
    // Reemplaza el body con los datos validados (sin campos adicionales)
    req.body = validatedData;
    
    next();
  } catch (error) {
    console.error("Error en validateSchema: ", error);
    if (error instanceof z.ZodError) {
      // Formatea los errores para una mejor respuesta
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Error de validación',
        errors: formattedErrors,
        errorCode: 'VALIDATION_ERROR'
      });
    }
    
    // Error inesperado
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor durante la validación'
    });
  }
};

/**
 * Limitador de tasa para endpoints de autenticación
 * @constant loginRateLimiter
 * @type {rateLimiter.RateLimit}
 * 
 * @description
 * Configuración de rate limiting para endpoints sensibles:
 * - Ventana: 15 minutos
 * - Máximo 10 peticiones por IP
 * - Manejo personalizado de respuestas
 */
const loginRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Límite por IP
  standardHeaders: true, // Devuelve headers de RateLimit-*
  legacyHeaders: false, // Deshabilita headers X-RateLimit-*
  skipSuccessfulRequests: false, // Cuenta todos los intentos
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Demasiados intentos de login. Por favor intente nuevamente en 15 minutos.',
      errorCode: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    });
  },
  keyGenerator: (req) => {
    // Clave basada en IP + ruta para mayor precisión
    return `${req.ip}_${req.path}`;
  }
});

module.exports = {
  validateSchema,
  loginRateLimiter
};