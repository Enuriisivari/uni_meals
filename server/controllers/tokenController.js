import Token from "../models/Token.js";

// Assign a new token
export const assignToken = async (req, res) => {
    try {
        const { token_id, delivery_staff_id, assigned_by_admin } = req.body;
        if (!token_id || !delivery_staff_id || !assigned_by_admin) return res.status(400).json({ message: "All fields are required" });

        const newToken = new Token({ token_id, delivery_staff_id, assigned_by_admin });
        const savedToken = await newToken.save();
        res.status(201).json({ message: "Token assigned successfully", token: savedToken });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all tokens
export const getTokens = async (req, res) => {
    try {
        const tokens = await Token.find().populate("delivery_staff_id", "name email").populate("assigned_by_admin", "name email").sort({ assigned_date: -1 });
        res.status(200).json({ success: true, data: tokens });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
