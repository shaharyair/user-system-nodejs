// Import necessary packages/modules
const express = require("express");
const morgan = require("morgan"); // Middleware for request logging
const moment = require("moment"); // Time manipulation library
const rateLimit = require("express-rate-limit"); // Rate limiting middleware
const helmet = require("helmet"); // Security headers middleware
const mongoSanitize = require("express-mongo-sanitize"); // Prevent NoSQL injection
const xss = require("xss-clean"); // Prevent cross-site scripting (XSS) attacks
const hpp = require("hpp"); // Prevent HTTP Parameter Pollution

// Import route handler for user-related routes
const userRouter = require("./routes/userRouter");
// Import global error controller
const globalErrorsController = require("./controllers/errorController");

// Create an Express application instance
const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Request logging using 'morgan' middleware with the 'tiny' format
if (process.env.NODE_ENV === "dev") app.use(morgan("tiny"));

// Apply security-related middlewares
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Configure rate limiting for API requests
const limiter = rateLimit({
  max: 100, // Maximum number of requests
  windowMs: moment.duration(1, "hours").asMilliseconds(), // Reset rate limiting after 1 hour
  message: "Too many requests from this user, try again in an hour.",
});
app.use("/api", limiter);

// Mount the userRouter middleware to handle user-related routes
app.use("/api/users", userRouter);

// Global error handling middleware
app.use(globalErrorsController);

// Export the Express application instance
module.exports = app;
