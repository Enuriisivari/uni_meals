import {
  registerUser,
  registerUserWithRole,
  loginUser,
  getUserById,
  getUserByEmail,
  toSafeUser,
  updateUserProfile,
  deleteUserById,
  resetUserPasswordByEmail,
} from "../../services/authService.js";
import { generateAuthToken } from "../utils/token.js";

export const registerStaff = async (req, res) => {
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

export const loginStaff = async (req, res) => {
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

export const getCurrentStaff = async (req, res) => {
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

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUserWithRole(name, email, password, "student");

    res.status(201).json({
      message: "Student account created successfully",
      user: toSafeUser(user),
      token: generateAuthToken(user),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    if (user.role !== "student") {
      return res.status(403).json({ error: "This account is not a student account" });
    }

    res.json({
      message: "Login successful",
      user: toSafeUser(user),
      token: generateAuthToken(user),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentStudent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ error: "Student access only" });
    }

    res.json(toSafeUser(req.user));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateCurrentStudent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ error: "Student access only" });
    }

    const avatarUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/staff-profiles/${req.file.filename}`
      : undefined;

    const user = await updateUserProfile(req.user.id, {
      ...req.body,
      avatarUrl,
    });

    res.json({
      message: "Student profile updated successfully",
      user: toSafeUser(user),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCurrentStudent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ error: "Student access only" });
    }

    await deleteUserById(req.user.id);
    res.json({ message: "Student account deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const forgotPasswordStudent = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await getUserByEmail(email);

    if (user.role !== "student") {
      return res.status(403).json({ error: "This account is not a student account" });
    }

    await resetUserPasswordByEmail(email, newPassword);
    res.json({ message: "Student password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
