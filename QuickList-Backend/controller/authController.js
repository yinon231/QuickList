const userRepository = require("../repository/userRepository");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const DUMMY_PASSWORD_HASH =
      "$2b$10$z8NZaTt8O0fdjx6YV2TZoOoAfCnbZMNJ99qVoY9FlxX8qT9pGmL2K";

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await userRepository.findUserByEmail(email);

    const passwordHash = user ? user.password : DUMMY_PASSWORD_HASH;
    const isPasswordValid = await userRepository.comparePassword(
      password,
      passwordHash
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const access_token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    const refresh_token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("jwt", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ access_token: access_token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = await userRepository.createUser({
      email,
      password,
    });
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.refreshTokenHandler = (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    return res.json({ access_token: accessToken });
  });
};
exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
