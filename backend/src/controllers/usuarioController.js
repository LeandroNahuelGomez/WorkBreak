const Usuario = require("../models/usuario");

const obtenerUsuarios = async (req, res) => {
    try{
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error){
        res.status(400).json({error: "Error al obtener usuarios"});
    }
};

const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  if (usuario) res.json(usuario);
  else res.status(404).json({ error: "Usuario no encontrado" });
};

const crearUsuario = async (req, res) => {
    const userData = req.body;

    try {
        const nuevoUsuario = await Usuario.create(userData);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error("Error al crear usuario:", error); // Muestra todo el error en consola

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
            error: "No se pudo crear el usuario",
            detalle: error.message || "Error desconocido"
        });
    }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: "No encontrado" });
  await usuario.update(datos);
  res.json(usuario);
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: "No encontrado" });
  await usuario.destroy();
  res.json({ mensaje: "Eliminado" });
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};