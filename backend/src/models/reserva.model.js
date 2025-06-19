const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Reserva = sequelize.define('Reserva', {
  reserva_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  cantidad_personas: {
    type: DataTypes.INTEGER
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
    defaultValue: 'pendiente'
  },
  monto_total: {
    type: DataTypes.DECIMAL(10, 2)
  },
  metodo_pago_id: {
    type: DataTypes.INTEGER
  },
  fecha_reserva: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reserva',
  timestamps: false
});

module.exports = Reserva;