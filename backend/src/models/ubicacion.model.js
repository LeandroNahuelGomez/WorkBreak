const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")

const Ubicacion = sequelize.define('Ubicacion', {
  ubicacion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pais: {
    type: DataTypes.STRING(100)
  },
  ciudad: {
    type: DataTypes.STRING(100)
  },
  direccion: {
    type: DataTypes.STRING(255)
  },
  codigo_postal: {
    type: DataTypes.STRING(20)
  },
  longitud: {
    type: DataTypes.DECIMAL(10, 7)
  }
}, {
  tableName: 'ubicacion',
  timestamps: false
});

module.exports = Ubicacion;