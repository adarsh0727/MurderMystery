const express = require("express");
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
require("dotenv").config();
const cors = require("cors");
const { connect } = require("./db/connect");
const cookiePaser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require("cookie-parser")());
app.use(express.static("public"));
app.use(cors());

// connection with mongodb database
connect();

app.use("/login", login);

app.use(cookiePaser());

app.listen(port, () => {
  console.log(`The Website started successfully on port ${port}`);
});

// creating socket :
const socket = require("socket.io");
const io = socket(server, {
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
});

// routes
// const loginRouter = require("./routes/loginRouter");
// app.use("/login", loginRouter);
// const userRouter = require("./routes/userRouter");
// app.use("/userin", userRouter);

// add-questions
const Question = require("./models/question");
app.post("/add-questions", async (req, res) => {
  const { question, answer } = req.body;
  const newQuestion = new Question({
    question,
    answer,
  });
  await newQuestion.save();
  res.status(201).json({
    message: "Question added successfully",
  });
});

//add-users
const User = require("./models/user");
app.post("/add-users", async (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({
    email,
    password,
  });

  await newUser.save();
  res.status(201).json({
    message: "User added successfully",
  });
});

// module.exports = io;

// Login :
const JWT = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { createTokenForUser } = require("./middlewares/authentication");
const path = require("path");

app.get("/login/userlogin", async (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/login.html"));
});

app.post("/login/userlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    console.log("user exists");

    //check if password is correct
    const validPassword = bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    //creating json web token :
    const jwt_token = createTokenForUser(user);
    console.log("everything before socket successfull");
    // startSocketConnection(io);
    // io.emit("login", "login succesfull");

    return res
      .cookie("token", jwt_token, {
        httpOnly: true,
        // secure: true, // for https connections
        // maxAge: 3600000, // cookie expiration duration
      })
      .json({
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
});

app.get("/", validateToken, async (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/question.html"));
});

const getLeaderboard = async (req, res) => {
  var leaderboard = [];
  const all_users = await User.find();
  // console.log(all_users);
  all_users.forEach((user) => {
    const userDetails = {
      name: user.email,
      score: user.score,
      time: user.time_taken,
    };
    leaderboard.push(userDetails);
  });

  return leaderboard;
};
app.post("/", validateToken, async (req, res) => {
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
      user.time_taken = Date.now();
      await user.save();

      // handling leaderboard :

      const leaderboard = await getLeaderboard();

      io.emit("leaderboard", leaderboard);

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
});

app.get("/leaderboard", validateToken, async (req, res) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname, "./public/leaderboard.html"));
});

app.get("/getLeaderboard", validateToken, async (req, res) => {
  const leaderboard = await getLeaderboard();
  console.log(leaderboard);
  return res.status(200).json({
    leaderboard: leaderboard,
  });
});
