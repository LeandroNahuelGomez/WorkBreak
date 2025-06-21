//External Import
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require('cors'); // Importa cors

//Local Import
const {sequelize, testConnection} = require("./src/config/db.config");
const mainRouter = require("./src/routes/mainRoutes");


//Start express
const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors()); // Esto permite todas las conexiones CORS (útil en desarrollo)


//Rutas
app.use(mainRouter);


app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000")
})