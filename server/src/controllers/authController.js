import {
  registerUser,
  loginUser,
  getUserById,
  registerDeliveryPerson,
  loginDeliveryPerson,
  getAllDeliveryPersons,
  resetDeliveryPersonPassword,
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

export const registerDelivery = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType } = req.body;

    const deliveryPerson = await registerDeliveryPerson(name, email, password, phone, vehicleType);

    res.status(201).json({
      message: "Delivery person registered successfully",
      deliveryPersonId: deliveryPerson._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginDelivery = async (req, res) => {
  try {
    const { email, password } = req.body;

    const deliveryPerson = await loginDeliveryPerson(email, password);

    res.json({
      message: "Delivery person login successful",
      deliveryPersonId: deliveryPerson._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllDelivery = async (req, res) => {
  try {
    const deliveryPersons = await getAllDeliveryPersons();
    res.json(deliveryPersons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPasswordDelivery = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and new password are required" });
    }
    await resetDeliveryPersonPassword(email, newPassword);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};