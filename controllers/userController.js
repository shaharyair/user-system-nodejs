const User = require("../models/user");

// Update user information
exports.updateUser = async (req, res, next) => {
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
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndRemove(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
