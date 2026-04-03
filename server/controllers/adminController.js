import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find the admin user in the MongoDB database
    const adminUser = await Admin.findOne({ email: normalizedEmail });

    if (!adminUser) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check if the password matches via bcrypt hashing OR direct plain-text matched comparison
    const isMatch = await bcrypt.compare(password, adminUser.password).catch(() => false);

    if (isMatch || password === adminUser.password) {
      res.status(200).json({
        success: true,
        data: { id: adminUser._id, name: adminUser.name, email: adminUser.email },
        token: generateToken(adminUser._id)
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
