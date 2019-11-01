const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointment = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "Patient" },
  doctor: { type: Schema.Types.ObjectId, ref: "Practise" },
  timing: { type: Object },
  type: { type: String },
  paid: { type: boolean, default: false },
  transactionId: { type: String },
  duration: { type: String },
  isApproved: { type: Boolean, default: false },
  cancelledByPatient: { type: Boolean, default: false },
  cancelledByDoctor: { type: Boolean, default: false }
});

//Exporting the model
module.export - mongoose.model("Appointments", appointment);
