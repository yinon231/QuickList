const userRepository = require("../repository/userRepository");
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
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
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
