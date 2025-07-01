const express = require("express");
const router = express.Router();

const { obtenerTickets, obtenerTicketPorId,crearTicket, actualizarTicket, eliminarTicket} = require("../controllers/ticketController");

router.get("/", obtenerTickets);
router.get("/:id", obtenerTicketPorId);
router.post("/", crearTicket);
router.put("/:id", actualizarTicket);      
router.delete("/:id", eliminarTicket);      

module.exports = router;