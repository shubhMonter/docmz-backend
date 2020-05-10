const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usermeta = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Patient" },
  referralId: { type: String, required: true, unique: true },
  referrals: [{ type: Schema.Types.ObjectId, ref: "Referral" }],
  weight: [
    {
      value: { type: String },
      practiseName: { type: String },
      practise: { type: Schema.Types.ObjectId, ref: "Practise" },
      modifiedBy: { type: String },
      date: { type: Date, default: Date.now() }
    }
  ],
  height: [
    {
      value: { type: String },
      practise: { type: Schema.Types.ObjectId, ref: "Practise" },
      practiseName: { type: String },
      modifiedBy: { type: String },
      date: { type: Date, default: Date.now() }
    }
  ],
  heartRate: [
    {
      value: { type: String },
      practise: { type: Schema.Types.ObjectId, ref: "Practise" },
      practiseName: { type: String },
      modifiedBy: { type: String },
      date: { type: Date, default: Date.now() }
    }
  ],
  bloodPressure: [
    {
      value: { type: String },
      practise: { type: Schema.Types.ObjectId, ref: "Practise" },
      practiseName: { type: String },
      modifiedBy: { type: String },
      date: { type: Date, default: Date.now() }
    }
  ],
  temperature: [
    {
      value: { type: String },
      practise: { type: Schema.Types.ObjectId, ref: "Practise" },
      practiseName: { type: String },
      modifiedBy: { type: String },
      date: { type: Date, default: Date.now() }
    }
  ],
  respiration: [
    {
      value: { type: String },
      practise: { type: Schema.Types.ObjectId, ref: "Practise" },
      practiseName: { type: String },
      modifiedBy: { type: String },
      date: { type: Date, default: Date.now() }
    }
  ],
  oxygen: [
    {
      value: { type: String },
      practise: { type: Schema.Types.ObjectId, ref: "Practise" },
      practiseName: { type: String },
      modifiedBy: { type: String },
      date: { type: Date, default: Date.now() }
    }
  ],
  medicines: [
    {
      type: Schema.Types.ObjectId,
      ref: "Medicine"
    }
  ]
});

module.exports = mongoose.model("Usermeta", Usermeta);
