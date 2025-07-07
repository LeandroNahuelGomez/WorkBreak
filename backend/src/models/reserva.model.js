module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    reserva_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    producto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Producto', // Asegúrate de que coincida con el nombre de tu modelo de producto
        key: 'producto_id'
      }
    },
    dia_reserva: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Fecha del día de la reserva'
    },
    hora_llegada: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: 'Hora de llegada (antes fecha_inicio)'
    },
    hora_salida: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: 'Hora de salida (antes fecha_fin)',
      validate: {
        isAfterHoraLlegada(value) {
          if (value <= this.hora_llegada) {
            throw new Error('La hora de salida debe ser posterior a la hora de llegada');
          }
        }
      }
    },
    cantidad_personas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    registro_fecha_reserva: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha y hora de creación del registro (antes fecha_reserva)'
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre de usuario no puede estar vacío'
        }
      },
      comment: 'Nombre del usuario que realiza la reserva'
    }
  }, {
    tableName: 'reserva',
    timestamps: false,
  });

  return Reserva;
};
