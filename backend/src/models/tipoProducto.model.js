module.exports = (sequelize, DataTypes) => {
  const TipoProducto = sequelize.define('TipoProducto', {
    tipo_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    icono_url: {
      type: DataTypes.STRING(255)
    }
  }, {
    tableName: 'tipo_producto',
    timestamps: false
  });

  return TipoProducto;
}


