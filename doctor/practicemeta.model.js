const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const practiceMeta = new Schema({
  practiceId: { type: Schema.Types.ObjectId, ref: "Practise" },
  recentPatients: [
    {
      patient: { type: Schema.Types.ObjectId, ref: "Patient" },
      createdAt: { type: Date, default: Date.now() }
    }
  ]
});
module.exports = mongoose.model("Practisemeta", practiceMeta);
