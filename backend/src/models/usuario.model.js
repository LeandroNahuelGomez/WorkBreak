const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")


const Usuario = sequelize.define("usuarios", {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // <-- Aquí estaba el error
    references: {
      model: "roles",
      key: "rol_id"
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false // <-- Cambiar de true a false
  },
  contrasena_hash: {
    type: DataTypes.STRING(255), // <-- Mejor usar 255
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  verificado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
}, {
  tableName: "usuarios",
  timestamps: false
});

module.exports = Usuario;
