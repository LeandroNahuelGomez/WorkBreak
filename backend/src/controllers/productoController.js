const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Producto = require("../models/producto.model")(sequelize, DataTypes);

// Obtener todos los productos activos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
  }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const productoId = await Producto.findByPk(id);
    res.json(productoId);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener el producto" });
  }
};

const crearProducto = async (req, res) => {
  try {
    const {
      tipo_producto_id,
      titulo,
      descripcion,
      capacidad,
      normas,
      precio_hora
    } = req.body;

    const imagen = req.file ? req.file.filename : null;

    const nuevoProducto = await Producto.create({
      tipo_producto_id,
      titulo,
      descripcion,
      capacidad,
      normas,
      precio_hora,
      imagen
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error al crear producto:", error);

    if (error.name === 'SequelizeValidationError') {
      const mensajes = error.errors.map(e => e.message);
      return res.status(400).json({
        error: "Errores de validación",
        detalles: mensajes
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      const mensajes = error.errors.map(e => e.message);
      return res.status(400).json({
        error: "Violación de restricción única",
        detalles: mensajes
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: "Violación de clave foránea",
        detalles: "El tipo de producto especificado no existe"
      });
    }

    return res.status(500).json({
      error: "No se pudo crear el producto",
      detalle: error.message || "Error desconocido"
    });
  }
};

// Actualizar producto (opcional: reemplazar imagen)
const actualizarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: "No encontrado" });

    const {
      tipo_producto_id,
      titulo,
      descripcion,
      capacidad,
      normas,
      precio_hora,
      activo
    } = req.body;

    // Si hay imagen nueva, se actualiza
    const nuevaImagen = req.file ? req.file.filename : producto.imagen;

    await producto.update({
      tipo_producto_id,
      titulo,
      descripcion,
      capacidad,
      normas,
      precio_hora,
      activo,
      imagen: nuevaImagen
    });

    res.json(producto);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto", detalle: error.message });
  }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ error: "No encontrado" });

    await producto.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto", detalle: error.message });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
