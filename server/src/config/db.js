import mongoose from "mongoose";

/** Supports MONGO_URI or MONGODB_URI (common Atlas dashboard name). */
function getMongoUri() {
  const raw = process.env.MONGO_URI || process.env.MONGODB_URI;
  return raw?.trim() || "";
}

const connectDB = async () => {
  const uri = getMongoUri();
  if (!uri) {
    console.error(
      "Missing database URL. Add MONGO_URI (or MONGODB_URI) to server/.env or the project root .env file."
    );
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected:", mongoose.connection.name);
  } catch (error) {
    console.error("Database connection failed:", error.message || error);
    process.exit(1);
  }
};

export default connectDB;