import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
      token: generateToken(newAdmin._id)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.status(200).json({
        success: true,
        data: { id: admin._id, name: admin.name, email: admin.email },
        token: generateToken(admin._id)
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Login error", error: error.message });
  }
};
