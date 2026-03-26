import Staff from "../models/Staff.js";

export const getStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find().select("-password");
    res.json({ success: true, data: staffMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newStaff = await Staff.create({ name, email, password });
    res.json({ success: true, data: newStaff });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staffId } = req.body;
    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Not found" });
    
    if (status) staff.status = status;
    if (staffId) staff.staffId = staffId;
    await staff.save();
    
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findByIdAndDelete(id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
