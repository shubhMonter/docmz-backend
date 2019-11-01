const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema Model
const schema = new Schema({
  email: { type: String, unique: true },
  role: { type: String },
  name: { type: String },
  phone: { type: String },
  password: { type: String },
  passwordtoken: { type: String },
  verified: { type: Boolean },
  passwordexpires: { type: Date },
  createdDate: { type: Date, default: Date.now },
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointments" }]
});

//Exporting the schema
module.exports = mongoose.model("Patient", schema);
