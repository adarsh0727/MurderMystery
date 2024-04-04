const { Router } = require("express");
const loginRouter = Router();

const {
  loginController,
  getLoginPage,
} = require("../controllers/loginController");
loginRouter.route("/userlogin").post(loginController).get(getLoginPage);

module.exports = loginRouter;
