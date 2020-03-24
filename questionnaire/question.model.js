const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const question = new Schema({
  title: { type: String },
  option: [
    {
      optionType: { type: String },
      text: { type: String },
      linkedQuestion: { type: Schema.Types.ObjectId, ref: "question" }
    }
  ]
});

module.exports = mongoose.model("question", question);
