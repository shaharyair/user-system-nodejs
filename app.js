const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");

const app = express();
app.use(express.json());

app.use(morgan("tiny"));

app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

app.use("/users", userRouter);

module.exports = app;
