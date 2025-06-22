module.exports = (sequelize, DataTypes) =>{
const atributoProducto = sequelize.define('AtributoProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  producto_id: {
    type: DataTypes.INTEGER
  },
  nombre_atributo: {
    type: DataTypes.STRING(50)
  },
  valor: {
    type: DataTypes.TEXT
  },
  tipo_dato: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'atributo_producto',
  timestamps: false
});

return atributoProducto;
};
