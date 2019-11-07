const db = require("_helpers/db"),
  express = require("express"),
  app = express(),
  Practise = db.Practise;
Appointment = db.Appointment;
Patient = db.User;

//Book an appointment
let bookAppointment = (req, res) => {
  let { doctor, patient } = req.body;
  let appointment = new Appointment(req.body);
  appointment
    .save()
    .then(data => {
      res
        .status(200)
        .json({ status: true, message: "Appointment Booked", data });
      let appointmentId = data._id;
      Practise.findByIdAndUpdate(doctor, {
        $push: { appointments: appointmentId }
      }).catch(error => console.log(error));
      Patient.findByIdAndUpdate(patient, {
        $push: { appointments: appointmentId }
      }).catch(error => console.log(error));
    })
    .catch(error => {
      res.status(400).json({ status: false, message: error });
    });
};

//Cancel appointment by Doctor
let cancelAppointment = (req, res) => {
  let { id, byDoctor, byPatient, reason } = req.body;
  Appointment.findByIdAndUpdate(
    id,
    {
      $set: {
        cancelByPatient: byPatient,
        cancelByDoctor: byDoctor,
        reasonForCancellation: reason
      }
    },
    { new: true }
  )
    .then(appointment => {
      res.status(200).json({
        status: true,
        message: "Appointment Cancelled",
        data: appointment
      });
    })
    .catch(error => {
      res.status(400).json({ status: false, message: error });
    });
};

module.exports = {
  cancelAppointment,
  bookAppointment
};
