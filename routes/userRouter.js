const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

// Get all users
router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers
);

// Register a new user
router.post("/register", authController.registerUser);

// User login
router.post("/login", authController.loginUser);

// forgot and reset Password
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// update Password
router.patch(
  "/updateUserPassword",
  authController.protect,
  authController.updatePassword
);

// Update user information
router.patch("/updateUser", authController.protect, userController.updateUser);

// Delete user
router.delete("/deleteUser", authController.protect, userController.deleteUser);

module.exports = router;
