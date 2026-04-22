import Order from "../models/orderModel.js";

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

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAllOrders = async ({ status, studentName } = {}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (studentName?.trim()) {
    query.studentName = new RegExp(`^${escapeRegex(studentName.trim())}$`, "i");
  }

  const orders = await Order.find(query).sort({ orderTime: -1 });
  return orders.map(toOrderResponse);
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) return null;
  return toOrderResponse(order);
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
