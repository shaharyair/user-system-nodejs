const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRouter");
const globalErrorsController = require("./controllers/errorController");

const app = express();
app.use(express.json());

app.use(morgan("tiny"));

app.use("/users", userRouter);

app.use(globalErrorsController);

module.exports = app;
