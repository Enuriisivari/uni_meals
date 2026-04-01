import Order from "../models/canteenOrderModel.js";

const toOrderResponse = (order) => ({
  id: order._id.toString(),
  studentName: order.studentName,
  deliveryLocation: order.deliveryLocation,
  notes: order.notes,
  status: order.status,
  orderTime: order.orderTime,
  totalPrice: order.totalPrice,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  items: order.items.map((item) => ({
    menuItemId: item.menuItemId?.toString() || "",
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
});

export const getAllOrders = async () => {
  const orders = await Order.find().sort({ orderTime: -1 });
  return orders.map(toOrderResponse);
};

export const updateOrderStatus = async (id, status) => {
  const validStatuses = [
    "pending",
    "preparing",
    "ready",
    "completed",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new Error("Order not found");
  }

  const allowedTransitions = {
    pending: ["preparing", "cancelled"],
    preparing: ["ready"],
    ready: ["completed"],
    completed: [],
    cancelled: [],
  };

  if (order.status === status) {
    return toOrderResponse(order);
  }

  if (!allowedTransitions[order.status]?.includes(status)) {
    throw new Error(
      `Cannot change order status from ${order.status} to ${status}`
    );
  }

  order.status = status;
  await order.save();

  return toOrderResponse(order);
};
