const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionnaire = new Schema(
  {
    title: { type: String },
    question: [{ type: Schema.Types.ObjectId, ref: "question" }],
    author: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("questionnaire", questionnaire);
