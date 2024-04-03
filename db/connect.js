const mongoose = require("mongoose");

async function connect() {
  try {
    mongoose.connect('mongodb+srv://<username>:usWx5t1LlRrrIrmT@cluster0.d0hatms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
      );
      process.exit();
    });
  } catch (error) {
    console.log("Failed to connect!!");
    console.log(error);
  }
}
module.exports = { connect}
