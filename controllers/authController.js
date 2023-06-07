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
    const { username, email, password, role } = req.body;
    const newUser = new User({ username, email, password, role });
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

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if the token exists in the request headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user ID from the token matches the user ID from the database
    if (decoded.userId != req.params.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Store the user object in the request for further processing
    req.user = user;

    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({ message: "Unauthorized", error });
  }
};

// restricts functions for specific roles in the app
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };
};
