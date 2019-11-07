const appointmentController = require("../appointments/appointment.controller");
const express = require("express");
const router = express.Router();

// Book an appointment
router.post("/book", appointmentController.bookAppointment);

//Cancel an appointment
router.post("/cancel", appointmentController.cancelAppointment);

// exporting them
module.exports = router;
