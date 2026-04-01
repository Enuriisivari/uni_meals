import express from 'express';
import DeliveryStaff from '../models/DeliveryStaff.js';
import bcrypt from 'bcrypt';
const router = express.Router();

// GET all staff
router.get('/all', async (req, res) => {
    const staff = await DeliveryStaff.find();
    res.json(staff);
});

// ADD new staff
router.post('/add', async (req, res) => {
    const { name, email, status } = req.body;
    
    // Check if email already exists
    const existingStaff = await DeliveryStaff.findOne({ email });
    if (existingStaff) {
        return res.status(400).json({ error: "Email already exists" });
    }
    
    const hashedPassword = await bcrypt.hash('password123', 10); // Default password
    const newStaff = new DeliveryStaff({ name, email, status, password: hashedPassword });
    await newStaff.save();
    res.json(newStaff);
});

// CREATIVE TOKEN ASSIGNMENT
router.put('/assign-token/:id', async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id);

        // Generate a "Smart Token"
        // Format: [Prefix based on rating]-[Random Hex]
        const prefix = staff.rating >= 4.5 ? "DS" : "SWIFT";
        const randomPart = Math.random().toString(16).slice(2, 6).toUpperCase();
        const newToken = `${prefix}-${randomPart}`;

        staff.activeToken = newToken;
        staff.status = 'Busy';
        await staff.save();

        res.json({ message: "Token Generated!", token: newToken });
    } catch (error) {
        res.status(500).json({ error: "Assignment failed" });
    }
});

// DELETE staff
router.delete('/:id', async (req, res) => {
    await DeliveryStaff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff removed" });
});

export default router;