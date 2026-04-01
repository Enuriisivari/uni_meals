import Order from "../models/Order.js";

// Fetch all orders with optional status filter
export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .populate("userId", "name email contact")
      .populate("canteenId", "name")
      .populate("deliveryTokenId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// Update order status/token
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryTokenId } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (status) order.status = status;
    if (deliveryTokenId) order.deliveryTokenId = deliveryTokenId;

    await order.save();
    res.status(200).json({ success: true, data: order, message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order", error: error.message });
  }
};
