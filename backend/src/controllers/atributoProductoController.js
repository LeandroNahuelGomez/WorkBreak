const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const atributoProducto = require("../models/atributoProducto.model")(sequelize, DataTypes);

