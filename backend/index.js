
// EXTERNAL IMPORTS
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// LOCAL IMPORTS
const { sequelize, testConnection } = require("./src/config/db.config");
const mainRouter = require("./src/routes/mainRoutes");
const { checkAuth, checkRole } = require("./src/middlewares/authMiddleware");


// EXPRESS APP
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Vistas (si usás EJS)
app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use("/", mainRouter);

// SERVER START
app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log("✅ DB conectada correctamente");
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error.message);
  }
});
