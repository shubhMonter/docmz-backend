const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const question = new Schema(
  {
    title: { type: String },
    superQuestion: { type: Boolean },
    option: [
      {
        optionType: { type: String },
        text: { type: String },
        linkedQuestion: [{ type: Schema.Types.ObjectId, ref: "question" }]
      }
    ],
    specialty: { type: String },
    category: { type: String },
    parent: { type: Schema.Types.ObjectId },
    optionText: { type: String },
    root: { type: Boolean, default: false } //Set true is its a root question
  },
  { timestamps: true }
);

module.exports = mongoose.model("question", question);
