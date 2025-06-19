const Producto = require("../models/producto.model");

const obtenerProducto = async (req, res) => {
    try{
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(400).json({error: "Error al obtener productos"})
    }
};

module.exports = {obtenerProducto};