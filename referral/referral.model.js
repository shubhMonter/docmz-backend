const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Referral = new mongoose.Schema({
  referrerType: { type: String, enum: ["Patient", "Practise"] }, //patient or doctor
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  referralId: { type: String }, //stores referral key

  referredTo: { type: String, enum: ["Patient", "Practise"] },
  registered: { type: Boolean, default: false },
  registeredId: { type: Schema.Types.ObjectId, refPath: "referredTo" }
});

module.exports = mongoose.model("Referral", Referral);
