import {
  registerUser,
  loginUser,
  getUserById,
  toSafeUser,
  updateUserProfile,
} from "../services/authService.js";
import { generateAuthToken } from "../utils/token.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json({
      message: "Canteen staff account created successfully",
      user: toSafeUser(user),
      token: generateAuthToken(user),
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
      user: toSafeUser(user),
      token: generateAuthToken(user),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user || (await getUserById(req.params.id));
    res.json(toSafeUser(user));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const avatarUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/staff-profiles/${req.file.filename}`
      : undefined;

    const user = await updateUserProfile(req.user.id, {
      ...req.body,
      avatarUrl,
    });

    res.json({
      message: "Profile updated successfully",
      user: toSafeUser(user),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
