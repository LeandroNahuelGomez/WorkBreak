const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")
const { ticketSchema } = require('../schemas/authSchemas'); // Asegúrate de que la ruta sea correcta
const { z } = require('zod'); // <-- Añade esta línea

const Ticket = require("../models/ticket.model")(sequelize, DataTypes);


const obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tickets', detalle: error.message });
  }
};

const obtenerTicketPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketId = await Ticket.findByPk(id);
        res.json(ticketId);
    } catch (error) {
        res.status(400).json({ error: "Error al obtener la ticket" })
    }
};

const crearTicket = async (req, res) => {
    const userData = req.body;

    try {
        // Validar los datos con Zod
        const validatedData = ticketSchema.parse(userData);

        // Crear la ubicación con los datos validados
        const nuevoTicket = await Ticket.create(validatedData);

        res.status(201).json(nuevoTicket);
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
            error: "No se pudo crear el Ticket",
            detalle: error.message || "Error desconocido"
        });
    }
};

const actualizarTicket = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  const ticket = await Ticket.findByPk(id);
  if (!ticket) return res.status(404).json({ error: "No encontrado" });
  await ticket.update(datos);
  res.json(usuario);
};

const eliminarTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findByPk(id);
  if (!ticket) return res.status(404).json({ error: "No encontrado" });
  await ticket.destroy();
  res.json({ mensaje: "Eliminado" });
};

module.exports = {
    obtenerTickets, 
    obtenerTicketPorId,
    crearTicket,
    actualizarTicket,
    eliminarTicket
};