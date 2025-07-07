const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")
const { tiposProductoSchema } = require('../schemas/authSchemas'); //Programar el schema de tipo producto
const { z } = require('zod'); // <-- Añade esta línea

const TipoProducto = require("../models/tipoProducto.model")(sequelize, DataTypes);

const obtenerTiposProductos = async (req, res) => {
  try {
    const tiposProductos = await TipoProducto.findAll();
    res.json(tiposProductos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tipos de productos:', detalle: error.message });
  }
};

const obtenerTipoProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoProductoId = await TipoProducto.findByPk(id);
        res.json(tipoProductoId);
    } catch (error) {
        res.status(400).json({ error: "Error al obtener el tipo del producto" })
    }
};

const crearTipoProducto = async (req, res) => {
    const userData = req.body;

    try {
        // Validar los datos con Zod
        const validatedData = tiposProductoSchema.parse(userData);

        // Crear la ubicación con los datos validados
        const nuevoTipoProducto = await TipoProducto.create(validatedData);

        res.status(201).json(nuevoTipoProducto);
    } catch (error) {
        console.error("Error al crear Tipo:", error); // Muestra todo el error en consola

         // Manejo de errores de Zod (validación)
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Errores de validación",
                detalles: error.errors.map(e => ({
                    campo: e.path.join('.'),
                    mensaje: e.message
                }))
            });
        }

        if (error.name === 'SequelizeValidationError') {
            // Errores de validación de campos obligatorios o tipos incorrectos
            const mensajes = error.errors.map(e => e.message);
            return res.status(400).json({
                error: "Errores de validación en base de datos",
                detalles: mensajes
            });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            // Errores por violar restricciones únicas (como email único)
            const mensajes = error.errors.map(e => e.message);
            return res.status(400).json({
                error: "Violación de restricción única",
                detalles: mensajes
            });
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            // Errores por usar un rol_id que no existe
            return res.status(400).json({
                error: "Violación de clave foránea",
                detalles: "El rol especificado no existe"
            });
        }

        // Otros errores generales
        return res.status(500).json({
            error: "No se pudo crear el tipo de producto",
            detalle: error.message || "Error desconocido"
        });
    }
};

const actualizarTipoProducto = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  const tipoProducto = await TipoProducto.findByPk(id);
  if (!tipoProducto) return res.status(404).json({ error: "No encontrado" });
  await tipoProducto.update(datos);
  res.json(usuario);
};

const eliminarTipoProducto = async (req, res) => {
  const { id } = req.params;
  const tipoProducto = await TipoProducto.findByPk(id);
  if (!tipoProducto) return res.status(404).json({ error: "No encontrado" });
  await tipoProducto.destroy();
  res.json({ mensaje: "Eliminado" });
};

module.exports = {
    obtenerTiposProductos, 
    obtenerTipoProductoPorId,
    crearTipoProducto,
    actualizarTipoProducto,
    eliminarTipoProducto
};