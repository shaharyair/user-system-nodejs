const jwt = require("jsonwebtoken");
const User = require("../models/user");

const signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
const registerUser = async (req, res, next) => {
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
const loginUser = async (req, res, next) => {
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

// Update user information
const updateUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { username, email });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndRemove(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };
