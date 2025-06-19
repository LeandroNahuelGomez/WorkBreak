const { DataTypes } = require("sequelize")
const { sequelize } = require("../config/db.config")

const Roles = sequelize.define('Roles', {
  rol_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Roles;