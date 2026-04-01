import {
  registerUser,
  loginUser,
  getUserById,
  changePassword,
} from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    res.json({
      message: "Login successful",
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    await changePassword(email, currentPassword, newPassword);

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};