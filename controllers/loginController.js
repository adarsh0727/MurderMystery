const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { createTokenForUser } = require("../middlewares/authentication");
const path = require("path");
const io = require("../server");

const getLoginPage = async (req, res) => {
  // console.log(__dirname, path.join("../..frontend/index.html"));
  res.sendFile(path.resolve(__dirname, "../public/login.html"));
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "User does not exist" }, { status: 400 });
    }
    console.log("user exists");

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    //creating json web token :
    const jwt_token = createTokenForUser(user);
    startSocketConnection(io);

    return res.status(200).json({
      message: "login successful",
      token: jwt_token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json("/", {
      error: "Incorrect Email or Password",
    });
  }
};

const startSocketConnection = (io) => {
  // console.log("socket connection started");
  try {
    io.on("connection", (socket) => {
      console.log("user connected", socket.id);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getLoginPage, loginController };
