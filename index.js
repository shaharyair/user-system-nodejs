const express = require("express");
const mongoose = require("mongoose");
const connectToDatabase = require("./db");
const userRouter = require("./routes/userRouter");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/users", userRouter);

const port = process.env.PORT || 3000;

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
  });
});
