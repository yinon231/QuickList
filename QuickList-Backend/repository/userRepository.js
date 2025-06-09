// repository/userRepository.js
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
