import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Dummy check for presentation
    if (email === "admin@unieats.com" && password === "admin123") {
      res.status(200).json({
        success: true,
        data: { name: "System Admin", email },
        token: generateToken("admin_id_123")
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
