const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const { ubicacionSchema } = require('../schemas/authSchemas'); // Asegúrate de que la ruta sea correcta
const { z } = require('zod'); // <-- Añade esta línea

const Ubicacion = require("../models/ubicacion.model")(sequelize, DataTypes);


const obtenerUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.findAll();
        res.json(ubicaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ubicaciones', detalle: error.message });
    }
};

const obtenerUbicacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const ubicacionId = await Ubicacion.findByPk(id);
        res.json(ubicacionId);
    } catch (error) {
        res.status(400).json({ error: "Error al obtener la ubicacion" })
    }
};

const crearUbicacion = async (req, res) => {
    const userData = req.body;

    try {
        // Validar los datos con Zod
        const validatedData = ubicacionSchema.parse(userData);

        // Crear la ubicación con los datos validados
        const nuevaUbicacion = await Ubicacion.create(validatedData);

        res.status(201).json(nuevaUbicacion);
    } catch (error) {
        console.error("Error al crear Ubicacion:", error); // Muestra todo el error en consola

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
            error: "No se pudo crear la ubicacion",
            detalle: error.message || "Error desconocido"
        });
    }
};

const actualizarUbicacion = async (req, res) => {
    const { id } = req.params;
    const datos = req.body;
    const ubicacion = await Ubicacion.findByPk(id);
    if (!ubicacion) return res.status(404).json({ error: "No encontrado" });
    await ubicacion.update(datos);
    res.json(usuario);
};

const eliminarUbicacion = async (req, res) => {
    const { id } = req.params;
    const ubicacion = await Ubicacion.findByPk(id);
    if (!ubicacion) return res.status(404).json({ error: "No encontrado" });
    await ubicacion.destroy();
    res.json({ mensaje: "Eliminado" });
};

module.exports = {
    obtenerUbicaciones,
    obtenerUbicacionPorId,
    crearUbicacion,
    actualizarUbicacion,
    eliminarUbicacion
};