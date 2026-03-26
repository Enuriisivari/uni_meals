import Order from "../models/Order.js";
import Feedback from "../models/Feedback.js";
import Budget from "../models/Budget.js";
import Staff from "../models/Staff.js";
import DeliveryStaff from "../models/DeliveryStaff.js";

// Generate System Report / Analytics Data
export const getAnalytics = async (req, res) => {
  try {
    // 1. Order Stats
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });
    
    // Revenue from delivered orders
    const revenueData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 2. Feedback Stats
    const totalFeedback = await Feedback.countDocuments();
    const averageRatingData = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const averageRating = averageRatingData.length > 0 ? averageRatingData[0].avgRating.toFixed(1) : 0;

    // 3. User Stats
    const totalStaff = await Staff.countDocuments();
    const totalDelivery = await DeliveryStaff.countDocuments();
    const staffCount = totalStaff + totalDelivery;
    const totalUsers = staffCount + 1; // plus 1 admin as approximation

    // 4. Budget Stats
    const budgets = await Budget.find();
    let totalAllocated = 0;
    let totalSpent = 0;
    budgets.forEach(b => {
      totalAllocated += b.allocatedAmount || 0;
      totalSpent += b.spentAmount || 0;
    });

    res.status(200).json({
      success: true,
      data: {
        orders: { total: totalOrders, delivered: deliveredOrders, cancelled: cancelledOrders, revenue: totalRevenue },
        feedback: { total: totalFeedback, averageRating },
        users: { total: totalUsers, staff: staffCount },
        budget: { allocated: totalAllocated, spent: totalSpent }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error generating analytics report", error: error.message });
  }
};
