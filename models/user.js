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

userSchema.pre("save", async function (next) {
  const user = this;
  const password = this.password

  if (!user.isModified("password")) return;
  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(password, salt);

  this.salt = salt;
  this.password = hashPassword;
  next();
});

const User = model("user", userSchema);

module.exports = User;
