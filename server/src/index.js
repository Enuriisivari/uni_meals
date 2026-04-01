import dotenv from "dotenv";
// 1. Initialize dotenv at the very top
dotenv.config(); 

import express from "express";
import cors from "cors";
import path from "node:path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

// 2. Connect to Database
connectDB();

// 3. Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

// 4. Routes
app.get("/", (req, res) => {
  res.send("UniEats Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/menu-items", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/student", studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
