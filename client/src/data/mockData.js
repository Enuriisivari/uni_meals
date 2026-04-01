const now = Date.now();

export const initialOrders = [
  {
    id: "ORD-1048",
    studentName: "Nethmi Perera",
    orderTime: new Date(now - 10 * 60 * 1000).toISOString(),
    deliveryLocation: "Engineering Faculty Lobby",
    status: "pending",
    notes: "Please send extra sambol.",
    items: [
      { name: "Chicken Kottu", quantity: 1, price: 850 },
      { name: "Lime Juice", quantity: 1, price: 220 },
    ],
    totalPrice: 1070,
  },
  {
    id: "ORD-1047",
    studentName: "Ravindu Silva",
    orderTime: new Date(now - 28 * 60 * 1000).toISOString(),
    deliveryLocation: "Library Entrance",
    status: "preparing",
    notes: "",
    items: [
      { name: "Rice and Curry", quantity: 2, price: 550 },
      { name: "Iced Milo", quantity: 1, price: 260 },
    ],
    totalPrice: 1360,
  },
  {
    id: "ORD-1046",
    studentName: "Heshani Fernando",
    orderTime: new Date(now - 52 * 60 * 1000).toISOString(),
    deliveryLocation: "Science Block A",
    status: "ready",
    notes: "No onions in the sandwich.",
    items: [
      { name: "Club Sandwich", quantity: 1, price: 620 },
      { name: "Fruit Salad", quantity: 1, price: 340 },
    ],
    totalPrice: 960,
  },
  {
    id: "ORD-1045",
    studentName: "Dinuka Jayawardena",
    orderTime: new Date(now - 95 * 60 * 1000).toISOString(),
    deliveryLocation: "Main Auditorium",
    status: "completed",
    notes: "",
    items: [
      { name: "Vegetable Fried Rice", quantity: 1, price: 640 },
      { name: "Water Bottle", quantity: 2, price: 80 },
    ],
    totalPrice: 800,
  },
  {
    id: "ORD-1044",
    studentName: "Ayesha Wickramasinghe",
    orderTime: new Date(now - 130 * 60 * 1000).toISOString(),
    deliveryLocation: "IT Center Reception",
    status: "cancelled",
    notes: "Call on arrival.",
    items: [
      { name: "Paneer Wrap", quantity: 1, price: 590 },
      { name: "Passion Fruit Juice", quantity: 1, price: 240 },
    ],
    totalPrice: 830,
  },
];
