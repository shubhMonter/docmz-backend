const db = require("_helpers/db"),
  express = require("express"),
  app = express(),
  Practise = db.Practise;
Appointment = db.Appointment;
Patient = db.User;

//Book an appointment
let bookAppointment = (req, res) => {
  let { patient, transactionId, timeSlot, practise } = req.body;

  Appointment.findByIdAndUpdate(
    timeSlot,
    {
      $set: {
        patient,
        transactionId,
        booked: true,
        paid: true
      }
    },
    { new: true }
  ).then(data => {
    Patient.findByIdAndUpdate(patient, { $push: { appointments: data._id } })
      .then(doctor => {
        Practise.findByIdAndUpdate(practise, {
          $push: { appointments: data._id }
        })
          .then(patient => {
            res
              .status(200)
              .json({ status: true, message: "Appointment Booked" });
          })
          .catch(error => {
            res.status(404).json({ status: false, message: error });
          });
      })
      .catch(err => {
        res.status(404).json({ status: false, message: err });
      });
  });
};

//Cancel appointment by Doctor
let cancelAppointment = (req, res) => {
  let { id, byDoctor, byPatient, reason } = req.body;
  Appointment.findByIdAndUpdate(
    id,
    {
      $set: {
        cancelledByPatient: byPatient,
        cancelledByDoctor: byDoctor,
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

// find({ sale_date: { $gt: ISODate("2014-11-04"), $lt: new ISODate("2014-11-05") });

module.exports = {
  cancelAppointment,
  bookAppointment
};
