const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Member = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  birthdate: { type: Date, required: true },
  gender: { type: String, required: true },
  relationship: { type: String, required: true }
});

module.exports = mongoose.model("Member", Member);
