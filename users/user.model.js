const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema Model
const schema = new Schema({
  email: { type: String, unique: true },
  role: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  phone: { type: String },
  home: { type: String },
  work: { type: String },
  preferredNumber: { type: String },
  Address: { type: Object },
  city: { type: String },
  country: { type: String },
  state: { type: String },
  sex: { type: String },
  dob: { type: String },
  active: { type: Boolean },
  wellnessReminder: { type: Boolean },
  appointmentReminderText: { type: Boolean },
  notify: { type: Boolean },
  race: { type: Array },
  ethnicity: { type: String },
  zip: { type: String },
  password: { type: String },
  passwordtoken: { type: String },
  verified: { type: Boolean },
  passwordexpires: { type: Date },
  createdDate: { type: Date, default: Date.now },
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointments" }],
  lastLogin: { type: Date, default: Date.now },
  bloodGroup: { type: String },
  customerProfile: { type: String },
  picture: { type: Array },
  records: [{ type: Object }],
  weight: {
    value: { type: String },
    practiseName: { type: String },
    practise: { type: Schema.Types.ObjectId, ref: "Practise" },
    modifiedBy: { type: String },
    date: { type: Date, default: Date.now() }
  },
  height: {
    value: { type: String },
    practise: { type: Schema.Types.ObjectId, ref: "Practise" },
    practiseName: { type: String },
    modifiedBy: { type: String },
    date: { type: Date, default: Date.now() }
  },
  heartRate: {
    value: { type: String },
    practise: { type: Schema.Types.ObjectId, ref: "Practise" },
    practiseName: { type: String },
    modifiedBy: { type: String },
    date: { type: Date, default: Date.now() }
  },
  bloodPressure: {
    value: { type: String },
    practise: { type: Schema.Types.ObjectId, ref: "Practise" },
    practiseName: { type: String },
    modifiedBy: { type: String },
    date: { type: Date, default: Date.now() }
  },

  temperature: {
    value: { type: String },
    practise: { type: Schema.Types.ObjectId, ref: "Practise" },
    practiseName: { type: String },
    modifiedBy: { type: String },
    date: { type: Date, default: Date.now() }
  },

  respiration: {
    value: { type: String },
    practise: { type: Schema.Types.ObjectId, ref: "Practise" },
    practiseName: { type: String },
    modifiedBy: { type: String },
    date: { type: Date, default: Date.now() }
  },
  oxygen: {
    value: { type: String },
    practise: { type: Schema.Types.ObjectId, ref: "Practise" },
    practiseName: { type: String },
    modifiedBy: { type: String },
    date: { type: Date, default: Date.now() }
  },
  meta: { type: Schema.Types.ObjectId, ref: "Usermeta" },
  favourites: [{ type: Schema.Types.ObjectId, ref: "Practise" }]
});

//Exporting the schema
module.exports = mongoose.model("Patient", schema);
