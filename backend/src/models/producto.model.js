const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")


module.exports = (sequelize, DataTypes) => {
const Producto = sequelize.define('Producto', {
  producto_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  capacidad: {
    type: DataTypes.INTEGER
  },
  normas: {
    type: DataTypes.TEXT
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'producto',
  timestamps: false
});

return Producto;
};