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

//Get appointments for the next 3 days
let getAppointments = (req, res) => {
  let { limit, doctor, date } = req.body;

  function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }
  // let today = new Date()
  let newDate = new Date(date);
  let nextDate = addDays(newDate, limit);
  console.log({ nextDate });
  Appointment.find({ doctor, bookedFor: { $gt: newDate, $lt: nextDate } })
    .sort({ bookedFor: 1 })
    .then(appointments => {
      res.status(200).json({
        status: true,
        message: "Appointments Fetched",
        data: appointments
      });
    })
    .catch(error => {
      res.status(404).json({ status: false, message: error });
    });
};
// find({ sale_date: { $gt: ISODate("2014-11-04"), $lt: new ISODate("2014-11-05") });

module.exports = {
  cancelAppointment,
  bookAppointment,
  getAppointments
};
