import dotenv from "dotenv";
// 1. Initialize dotenv at the very top
dotenv.config(); 

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// 2. Connect to Database
connectDB();

// 3. Middleware
app.use(cors());
app.use(express.json());

// 4. Routes
app.get("/", (req, res) => {
  res.send("UniEats Backend Running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});