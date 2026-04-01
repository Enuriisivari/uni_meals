import MenuItem from "../models/menuItemModel.js";
import Order from "../models/canteenOrderModel.js";
import { getAvailableMenuItems } from "./menuService.js";

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

export const getStudentMenuItems = async () => getAvailableMenuItems();

export const createStudentOrder = async ({
  studentName,
  deliveryLocation,
  notes,
  items,
}) => {
  if (!studentName?.trim()) {
    throw new Error("Student name is required");
  }

  if (!deliveryLocation?.trim()) {
    throw new Error("Delivery location is required");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one item is required");
  }

  const requestedItems = items
    .map((item) => ({
      menuItemId: item.menuItemId,
      quantity: Number(item.quantity),
    }))
    .filter((item) => item.menuItemId && item.quantity > 0);

  if (requestedItems.length === 0) {
    throw new Error("At least one valid item is required");
  }

  const ids = requestedItems.map((item) => item.menuItemId);
  const menuItems = await MenuItem.find({
    _id: { $in: ids },
    available: true,
  });

  if (menuItems.length !== requestedItems.length) {
    throw new Error("Some selected menu items are unavailable");
  }

  const menuMap = new Map(menuItems.map((item) => [item._id.toString(), item]));
  const orderItems = requestedItems.map((item) => {
    const menuItem = menuMap.get(item.menuItemId);

    return {
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
    };
  });

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    studentName: studentName.trim(),
    deliveryLocation: deliveryLocation.trim(),
    notes: notes?.trim() || "",
    items: orderItems,
    totalPrice,
  });

  return toOrderResponse(order);
};

export const getStudentOrders = async (studentName) => {
  if (!studentName?.trim()) {
    return [];
  }

  const orders = await Order.find({
    studentName: new RegExp(`^${studentName.trim()}$`, "i"),
  })
    .sort({ orderTime: -1 })
    .limit(20);

  return orders.map(toOrderResponse);
};
