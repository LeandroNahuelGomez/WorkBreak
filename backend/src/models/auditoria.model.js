const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Auditoria = sequelize.define('Auditoria', {
  auditoria_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accion: {
    type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
    allowNull: false
  },
  tabla_afectada: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  registro_id_afectado: {
    type: DataTypes.INTEGER
  },
  descripcion_cambio: {
    type: DataTypes.TEXT
  },
  fecha_hora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'auditoria',
  timestamps: false
});

module.exports = Auditoria;