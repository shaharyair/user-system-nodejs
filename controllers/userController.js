const User = require("../models/user");

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

exports.updateUser = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      next(new AppError("This route is only for data updates.", 400));
    }

    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
