import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/orderService.js";
import { createStudentOrder } from "../services/studentService.js";

export const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let orders = await getAllOrders();
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await createStudentOrder(req.body);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required in body",
      });
    }
    const order = await updateOrderStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    const msg = error.message || "Error updating order";
    const code =
      msg === "Order not found" ? 404 : msg.includes("Invalid") || msg.includes("Cannot") ? 400 : 500;
    res.status(code).json({ success: false, message: msg });
  }
};
