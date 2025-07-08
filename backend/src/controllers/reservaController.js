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

const verificarDisponibilidad = async (req, res) => {
  try {
    const { producto_id, fecha, hora_entrada, hora_salida } = req.query;

    console.log('Parámetros recibidos:', { producto_id, fecha, hora_entrada, hora_salida });

    if (!producto_id || !fecha || !hora_entrada || !hora_salida) {
      return res.status(400).json({ 
        error: "Parámetros requeridos: producto_id, fecha, hora_entrada, hora_salida" 
      });
    }

    // Buscar reservas existentes usando los nombres correctos de columnas
    const reservasExistentes = await Reserva.findAll({
      where: {
        producto_id: parseInt(producto_id),
        dia_reserva: fecha
      }
    });

    console.log('Reservas encontradas:', reservasExistentes.length);

    // Si no hay reservas existentes, está disponible
    if (reservasExistentes.length === 0) {
      return res.json({
        disponible: true,
        mensaje: "Horario disponible"
      });
    }

    // Convertir las horas a minutos para una comparación más precisa
    const convertirHoraAMinutos = (hora) => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };

    const nuevaEntradaMinutos = convertirHoraAMinutos(hora_entrada);
    const nuevaSalidaMinutos = convertirHoraAMinutos(hora_salida);

    console.log(`Nueva reserva: ${hora_entrada} (${nuevaEntradaMinutos} min) - ${hora_salida} (${nuevaSalidaMinutos} min)`);

    // Verificar conflictos de horarios
    for (const reserva of reservasExistentes) {
      console.log('Verificando conflicto con reserva:', reserva.reserva_id);
      
      // Convertir horas de la reserva existente a minutos
      const reservaEntradaMinutos = convertirHoraAMinutos(reserva.hora_llegada);
      const reservaSalidaMinutos = convertirHoraAMinutos(reserva.hora_salida);

      console.log(`Reserva existente: ${reserva.hora_llegada} (${reservaEntradaMinutos} min) - ${reserva.hora_salida} (${reservaSalidaMinutos} min)`);
      
      // ✅ LÓGICA CORREGIDA: Verificar si hay solapamiento
      const hayConflicto = !(
        nuevaSalidaMinutos <= reservaEntradaMinutos ||  // La nueva termina antes de que empiece la existente
        nuevaEntradaMinutos >= reservaSalidaMinutos     // La nueva empieza después de que termine la existente
      );

      console.log('¿Hay conflicto?', hayConflicto);

      if (hayConflicto) {
        console.log('🚫 Conflicto encontrado con reserva:', reserva.reserva_id);
        return res.json({
          disponible: false,
          mensaje: `Horario no disponible. Conflicto con reserva existente (${reserva.hora_llegada} - ${reserva.hora_salida})`,
          reserva_conflicto: {
            id: reserva.reserva_id,
            hora_entrada: reserva.hora_llegada,
            hora_salida: reserva.hora_salida
          }
        });
      }
    }

    // Si no hay conflictos, está disponible
    console.log('✅ Horario disponible');
    res.json({
      disponible: true,
      mensaje: "Horario disponible"
    });

  } catch (error) {
    console.error("Error completo al verificar disponibilidad:", error);
    console.error("Stack trace:", error.stack);
    
    res.status(500).json({ 
      error: "Error interno del servidor al verificar disponibilidad", 
      detalle: error.message,
      tipo: error.name
    });
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
    eliminarReserva,
    verificarDisponibilidad
};