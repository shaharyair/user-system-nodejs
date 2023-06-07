const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// Register a new user
router.post("/register", authController.registerUser);

// User login
router.post("/login", authController.loginUser);

// Update user information
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
