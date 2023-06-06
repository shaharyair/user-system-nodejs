const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Update user information
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
