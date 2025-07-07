const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")
const { reservaSchema } = require('../schemas/authSchemas'); // Asegúrate de que la ruta sea correcta
const { z } = require('zod'); // <-- Añade esta línea

const Reserva = require("../models/reserva.model")(sequelize, DataTypes);


const obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas', detalle: error.message });
  }
};

const obtenerReservaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const reservaId = await Reserva.findByPk(id);
        res.json(reservaId);
    } catch (error) {
        res.status(400).json({ error: "Error al obtener la reserva" })
    }
};

const crearReserva = async (req, res) => {
    const userData = req.body;

    try {
        // Validar los datos con Zod
        const validatedData = reservaSchema.parse(userData);

        // Crear la ubicación con los datos validados
        const nuevaReserva = await Reserva.create(validatedData);

        res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error("Error al crear la Reserva:", error); // Muestra todo el error en consola

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
            error: "No se pudo crear la reserva",
            detalle: error.message || "Error desconocido"
        });
    }
};

const actualizarReserva = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  const reserva = await Reserva.findByPk(id);
  if (!reserva) return res.status(404).json({ error: "No encontrado" });
  await reserva.update(datos);
  res.json(reserva);
};

const eliminarReserva = async (req, res) => {
  const { id } = req.params;
  const reserva = await Reserva.findByPk(id);
  if (!reserva) return res.status(404).json({ error: "No encontrado" });
  await reserva.destroy();
  res.json({ mensaje: "Eliminado" });
};

module.exports = {
    obtenerReservas,
    obtenerReservaPorId,
    crearReserva,
    actualizarReserva,
    eliminarReserva
};