const User = require("../models/user");

// Update user information
exports.updateUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { username, email });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndRemove(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
