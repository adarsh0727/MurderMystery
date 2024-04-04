const User = require("../models/user");
const Question = require("../models/question");
const path = require("path");

const handleAnswerInput = async (req, res) => {
  try {
    const { ans_input, number } = req.body;

    const user_id = req.userAuth.id;
    const user = await User.findOne({ _id: user_id });

    const question = await Question.findOne({ question_img: `${number}.jpg` });
    if (!question) {
      return res.status(400).json({ error: "No Question Exist with this ID" });
    }
    if (ans_input === question.answer) {
      console.log(user);
      user.score += 1;
      await user.save();
      return res.status(200).json({
        user,
        message: "correct answer",
      });
    } else {
      return res.status(400).json({
        message: "incorrect answer",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: "Some Error Occured",
    });
  }
};

module.exports = { handleAnswerInput };
