import DeliveryPerson from "../models/DeliveryPerson.js";

export const getDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find().select("-password");
    res.json({ success: true, data: deliveryPersons });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createDeliveryPerson = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newDelivery = await DeliveryPerson.create({ name, email, password });
    res.json({ success: true, data: newDelivery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const delivery = await DeliveryPerson.findById(id);
    if (!delivery) return res.status(404).json({ message: "Not found" });
    
    if (status) delivery.status = status;
    await delivery.save();
    
    res.json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;
    await DeliveryPerson.findByIdAndDelete(id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
