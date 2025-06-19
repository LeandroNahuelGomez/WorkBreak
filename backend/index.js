const express = require("express");

const app = express();

const sequelize = require("./src/config/db.config");
const usuarioRoutes = require("./src/routes/usuarioRoutes");

app.use(express.json());
app.use("/api", usuarioRoutes);

app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000")
})