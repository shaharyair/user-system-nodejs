const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token
    const token = signToken(newUser._id);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    next(error);
  }
};

// User login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = signToken(user._id);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};
