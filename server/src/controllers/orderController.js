import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService.js";

export const listOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);
    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
