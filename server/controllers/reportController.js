import Order from "../models/Order.js";
import Staff from "../models/Staff.js";

export const generateOrdersReport = async (req, res) => {
  try {
    const orders = await Order.find().populate("deliveryTokenId").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating report", error: error.message });
  }
};

export const generateRevenueReport = async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    res.status(200).json({ success: true, data: revenueData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating report", error: error.message });
  }
};
