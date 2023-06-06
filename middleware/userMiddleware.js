// middleware.js
const bcrypt = require("bcrypt");

// Hash the password before saving the user
async function hashPasswordMiddleware(next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
}

// Method to compare entered password with the stored hashed password
async function comparePasswordMiddleware(password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = { hashPasswordMiddleware, comparePasswordMiddleware };
