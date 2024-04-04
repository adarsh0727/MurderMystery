const { Router } = require("express");
const userRouter = Router();
const { validateToken } = require("../middlewares/authentication");

const { handleAnswerInput } = require("../controllers/userController");
userRouter
  .route("/:questionID/userinput")
  .post(validateToken, handleAnswerInput);

module.exports = userRouter;
