//External Import
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

//Local Import
const {sequelize, testConnection} = require("./src/config/db.config");
const mainRouter = require("./src/routes/mainRoutes");

//Start express
const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(morgan("dev"));

//Rutas
app.use(mainRouter);

// //Manejo de rutas no encontradas
// app.use("*", (req,res) => {
//     res.status(400).json({
//         status: "error",
//         message: "Ruta no encontrada"
//     });
// });

// Conexión a la base de datos y levantado del servidor
// const PORT = process.env.PORT || 3000;
// testConnection().then(() => {
//   app.listen(PORT, () => {
//     console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
//   });
// });

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000")
})