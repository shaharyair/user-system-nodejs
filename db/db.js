const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.LOCAL_DATABASE);
    console.log("Database Connection Successful...");
  } catch (error) {
    console.error("Database Connection Failed:", error);
  }
}

module.exports = connectToDatabase;
