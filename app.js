const express = require("express");
const morgan = require("morgan");
const moment = require("moment");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routes/userRouter");
const globalErrorsController = require("./controllers/errorController");

const app = express();
app.use(express.json());

app.use(morgan("tiny"));

const limiter = rateLimit({
  max: 100,
  windowMs: moment.duration(1, "hours").asMilliseconds(),
  message: "Too many requests from this user, try again in an hour.",
});

app.use("/api", limiter);

app.use("/api/users", userRouter);

app.use(globalErrorsController);

module.exports = app;
