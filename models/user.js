const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    }
  }   
);


const User = model("user", userSchema);

module.exports = User;
