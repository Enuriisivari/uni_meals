import express from "express";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";
import deliveryRoutes from "../routes/deliveryRoutes.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/delivery", deliveryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
