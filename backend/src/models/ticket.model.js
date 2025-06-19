const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Ticket = sequelize.define('Ticket', {
  ticket_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reserva_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  codigo_ticket: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  fecha_emision: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('generado', 'pagado', 'cancelado', 'utilizado'),
    defaultValue: 'generado'
  },
  qr_url: {
    type: DataTypes.STRING(255)
  },
  detalles: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'ticket',
  timestamps: false
});

module.exports = Ticket;