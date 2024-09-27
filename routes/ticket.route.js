const express = require("express");
const router = express.Router();

const { createTicket } = require("../controller/ticket.controller");

// ticket routes
router.post("/create_ticket", createTicket);

module.exports = router;
