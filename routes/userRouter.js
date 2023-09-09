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

// Update user information
router.put("/:id", authController.protect, userController.updateUser);

// Delete user
router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteUser
);

module.exports = router;
