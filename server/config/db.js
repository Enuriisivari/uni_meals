import mongoose from "mongoose";
import dns from "node:dns";

// Force Node to use Google DNS for this process
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Keep the server running for local dev/testing even when the DB URI is invalid.
    // Routes that require DB data will still fail, but the app itself can start.
    return null;
  }
};


export default connectDB;