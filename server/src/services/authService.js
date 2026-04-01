import User from "../models/userModel.js";
import DeliveryPerson from "../models/deliveryPersonModel.js";
import bcrypt from "bcrypt";

export const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

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

export const registerDeliveryPerson = async (name, email, password, phone, vehicleType) => {
  const existingPerson = await DeliveryPerson.findOne({ email });

  if (existingPerson) {
    throw new Error("Delivery person already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const deliveryPerson = await DeliveryPerson.create({
    name,
    email,
    password: hashedPassword,
    phone,
    vehicleType,
  });

  return deliveryPerson;
};

export const loginDeliveryPerson = async (email, password) => {
  const deliveryPerson = await DeliveryPerson.findOne({ email });

  if (!deliveryPerson) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, deliveryPerson.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return deliveryPerson;
};

export const getAllDeliveryPersons = async () => {
  const deliveryPersons = await DeliveryPerson.find({}).select("-password");
  return deliveryPersons;
};

export const resetDeliveryPersonPassword = async (email, newPassword) => {
  const deliveryPerson = await DeliveryPerson.findOne({ email });
  
  if (!deliveryPerson) {
    throw new Error("Delivery person not found");
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  deliveryPerson.password = hashedPassword;
  await deliveryPerson.save();
  
  return deliveryPerson;
};