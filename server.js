const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { connect } = require("./db/connect");
const cookiePaser = require("cookie-parser");

app.use(express.static("public"))

app.use(cors());
// routes
const login = require("./routes/login");


connect();

app.use("/login", login);


app.use(cookiePaser());

app.listen(port, () => {
  console.log(`The Website started successfully on port ${port}`);
});
