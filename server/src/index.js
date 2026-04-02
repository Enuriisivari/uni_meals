import express from "express";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";
import deliveryRoutes from "../routes/deliveryRoutes.js";
import path from "node:path";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
dotenv.config();

const app = express();

// Connect DB
connectDB();

app.use(cors());
// 3. Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/menu-items", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/student", studentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
