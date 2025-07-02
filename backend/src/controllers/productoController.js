const { DataTypes, Op } = require("sequelize")
const { sequelize } = require("../config/db.config")

const Producto = require("../models/producto.model")(sequelize, DataTypes);


const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const productoId = await Producto.findByPk(id);
        res.json(productoId);
    } catch (error) {
        res.status(400).json({ error: "Error al obtener el producto" })
    }
};

const crearProducto = async (req, res) => {
    const userData = req.body;

    try {
        const nuevoProducto = await Producto.create(userData);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error); // Muestra todo el error en consola

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
            error: "No se pudo crear el producto",
            detalle: error.message || "Error desconocido"
        });
    }
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  const producto = await Producto.findByPk(id);
  if (!producto) return res.status(404).json({ error: "No encontrado" });
  await producto.update(datos);
  res.json(usuario);
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id);
  if (!producto) return res.status(404).json({ error: "No encontrado" });
  await producto.destroy();
  res.json({ mensaje: "Eliminado" });
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};