const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const atributoProducto = require("../models/atributoProducto.model")(sequelize, DataTypes);

const obtenerAtributosProducto = async (req, res) => {
    try {
        const atributos = await atributoProducto.findAll();
        res.json(atributos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener atributos", detalle: error.message });
    }
};

const crearAtributoProducto = async (req, res) => {
    const data = req.body;
    try {
        const nuevoAtributo = await atributoProducto.create(data);
        res.status(201).json(nuevoAtributo);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const mensajes = error.errors.map(e => e.message);
            return res.status(400).json({ error: "Errores de validación", detalles: mensajes });
        }
        res.status(500).json({ error: "Error al crear atributo", detalle: error.message });
    }
};

const actualizarAtributoProducto = async (req, res) => {
    const { id } = req.params;
    const datos = req.body;
    try {
        const atributo = await atributoProducto.findByPk(id);
        if (!atributo) return res.status(404).json({ error: "Atributo no encontrado" });
        await atributo.update(datos);
        res.json(atributo);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar", detalle: error.message });
    }
};

const eliminarAtributoProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const atributo = await atributoProducto.findByPk(id);
        if (!atributo) return res.status(404).json({ error: "Atributo no encontrado" });
        await atributo.destroy();
        res.json({ mensaje: "Atributo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar", detalle: error.message });
    }
};

module.exports = {
    obtenerAtributosProducto,
    crearAtributoProducto,
    actualizarAtributoProducto,
    eliminarAtributoProducto  // ¡Descomentada y corregida!
};
