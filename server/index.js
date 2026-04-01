import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import discountRoutes from "./routes/discountRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import reportRoutes from "./routes/reportRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import canteenOrderRoutes from "./routes/canteenOrderRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import path from "node:path";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/canteen-orders", canteenOrderRoutes);
app.use("/api/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("UniEats Backend Running");
});

app.use(notFound);
app.use(errorHandler);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});