import User from "../models/userModel.js";
import DeliveryPerson from "../models/deliveryPersonModel.js";
import bcrypt from "bcrypt";

const normalizeEmail = (email) => email.trim().toLowerCase();

export const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarUrl: user.avatarUrl || "",
  createdAt: user.createdAt,
});

export const registerUser = async (name, email, password) => {
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    throw new Error("Name, email, and password are required");
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "canteen_staff",
  });

  return user;
};

export const loginUser = async (email, password) => {
  if (!email?.trim() || !password?.trim()) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateUserProfile = async (id, payload) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  const nextName = payload.name ?? user.name;
  const nextEmail = payload.email ?? user.email;
  const nextAvatarUrl = payload.avatarUrl || user.avatarUrl || "";

  if (!nextName?.trim() || !nextEmail?.trim()) {
    throw new Error("Name and email are required");
  }

  const normalizedEmail = normalizeEmail(nextEmail);
  const existingUser = await User.findOne({
    email: normalizedEmail,
    _id: { $ne: user._id },
  });

  if (existingUser) {
    throw new Error("Email is already in use");
  }

  user.name = nextName.trim();
  user.email = normalizedEmail;
  user.avatarUrl = nextAvatarUrl.trim();

  await user.save();

  return user;
};
