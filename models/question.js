const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question_img: {
    type: String,
  },
  // question: {
  //   type: String,
  //   required: true,
  // },
  answer: {
    type: String,
    required: true,
  },
});

Question = mongoose.model("question", questionSchema);
module.exports = Question;
