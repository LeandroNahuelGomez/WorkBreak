const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const { rolSchema } = require('../schemas/authSchemas'); // Asegúrate de que la ruta sea correcta
const { z } = require('zod'); // <-- Añade esta línea


const Roles = require("../models/roles.model")(sequelize, DataTypes);


const obtenerRoles = async (req, res) => {
    try {
        const roles = await Roles.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener roles', detalle: error.message });
    }
};

const obtenerRolPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const rolId = await Roles.findByPk(id);
        res.json(rolId);
    } catch (error) {
        res.status(400).json({ error: "Error al obtener el rol" })
    }
};

const crearRol = async (req, res) => {
    const userData = req.body;

    try {
        // Validar los datos con Zod
        const validatedData = rolSchema.parse(userData);

        // Crear la ubicación con los datos validados
        const nuevoRol = await Roles.create(validatedData);
        res.status(201).json(nuevoRol);
    } catch (error) {

        console.error("Error al crear Ticket:", error); // Muestra todo el error en consola

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
                error: "Errores de validación",
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
            error: "No se pudo crear el rol",
            detalle: error.message || "Error desconocido"
        });
    }
};

const actualizarRol = async (req, res) => {
    const { id } = req.params;
    const datos = req.body;
    const rol = await Roles.findByPk(id);
    if (!rol) return res.status(404).json({ error: "No encontrado" });
    await rol.update(datos);
    res.json(usuario);
};

const eliminarRol = async (req, res) => {
    const { id } = req.params;
    const rol = await Roles.findByPk(id);
    if (!rol) return res.status(404).json({ error: "No encontrado" });
    await rol.destroy();
    res.json({ mensaje: "Eliminado" });
};

module.exports = {
    obtenerRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
};