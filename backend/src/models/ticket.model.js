module.exports = (sequelize, DataTypes) => {
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
  nombre_usuario: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'ticket',
  timestamps: false
});

return Ticket;
};