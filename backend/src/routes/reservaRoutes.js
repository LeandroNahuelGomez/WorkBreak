const express = require("express");
const router = express.Router();

const { obtenerReservaPorId, obtenerReservas, actualizarReserva, eliminarReserva, crearReserva, verificarDisponibilidad} = require("../controllers/reservaController");

router.get('/disponibilidad', verificarDisponibilidad);
router.get("/", obtenerReservas);
router.get("/:id", obtenerReservaPorId);
router.post("/", crearReserva);
router.put("/:id", actualizarReserva);      
router.delete("/:id", eliminarReserva);      

module.exports = router;