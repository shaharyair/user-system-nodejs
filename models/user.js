const mongoose = require("mongoose");
const {
  hashPasswordMiddleware,
  comparePasswordMiddleware,
} = require("../middleware/userMiddleware");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9_-]+$/.test(value);
      },
      message:
        "Username can only contain letters, numbers, underscores, and dashes.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
      },
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
          value
        );
      },
      message:
        "Password must contain at least 8 characters, including one lowercase letter, one uppercase letter, one number, and one special character.",
    },
  },
});

userSchema.pre("save", hashPasswordMiddleware);
userSchema.methods.comparePassword = comparePasswordMiddleware;

const User = mongoose.model("User", userSchema);

module.exports = User;
