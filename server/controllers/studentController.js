import {
  createStudentOrder,
  getStudentMenuItems,
  getStudentOrders,
} from "../services/studentService.js";

export const listStudentMenuItems = async (req, res) => {
  try {
    const items = await getStudentMenuItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await createStudentOrder(req.body);
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listStudentOrders = async (req, res) => {
  try {
    const orders = await getStudentOrders(req.query.studentName);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
