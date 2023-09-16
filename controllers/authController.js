const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const moment = require("moment");

const signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  // Generate JWT token
  const token = signToken(user._id);

  const cookieOptions = {
    expires: moment().add(process.env.JWT_COOKIE_EXPIRES_IN, "days").toDate(),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "prod") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// Register a new user
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password, passwordConfirm, role } = req.body;

    const newUser = new User({
      username,
      email,
      password,
      passwordConfirm,
      role,
    });
    await newUser.save();

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

// User login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("invaild email or password", 401));
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new AppError("invaild email or password", 401));
    }

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
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
      return next(new AppError("Token is invaild", 401));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new AppError("User was not found!", 401));
    }

    // Store the user object in the request for further processing
    req.user = user;

    next();
  } catch (error) {
    // Handle token verification errors
    return next(new AppError("Token was not verified", 401));
  }
};

// restricts functions for specific roles in the app
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Unauthorized action", 401));
    }
    next();
  };
};

// generates a reset password token
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Click the link below.\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset link",
        message,
      });

      res.status(200).json({
        message: "Link sent to email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email, Please try again later.",
          500
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user.comparePassword(req.body.passwordCurrent)) {
      return next(new AppError("Your current password is incorrect", 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
