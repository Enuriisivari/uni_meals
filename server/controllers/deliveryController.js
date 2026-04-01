import DeliveryStaff from "../models/DeliveryStaff.js";

export const getDeliveryStaffs = async (req, res) => {
  try {
    const deliveryStaffs = await DeliveryStaff.find().select("-password");
    res.json({ success: true, data: deliveryStaffs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createDeliveryStaff = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newDeliveryStaff = await DeliveryStaff.create({ name, email, password });
    res.json({ success: true, data: newDeliveryStaff });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateDeliveryStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const delivery = await DeliveryStaff.findById(id);
    if (!delivery) return res.status(404).json({ message: "Not found" });
    
    if (status) delivery.status = status;
    await delivery.save();
    
    res.json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteDeliveryStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await DeliveryStaff.findByIdAndDelete(id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
