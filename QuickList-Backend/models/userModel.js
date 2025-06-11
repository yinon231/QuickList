const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      parseInt(process.env.SALT_ROUNDS)
    );
  }
  next();
});
module.exports = mongoose.model("users", userSchema);
