const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointment = new Schema({
  bookedOn: { type: Date, default: Date.now },
  patient: { type: Schema.Types.ObjectId, ref: "Patient" },
  doctor: { type: Schema.Types.ObjectId, ref: "Practise" },
  bookedFor: { type: Object },
  cancelledByPatient: { type: Boolean, default: false },
  cancelledByDoctor: { type: Boolean, default: false },
  transactionId: { type: String },
  reasonForCancellation: { type: String },
  availabilitySelected: { type: String },
  paid: { type: boolean, default: false },
  duration: { type: String }
});

module.exports = mongoose.model("Appointments", appointment);
