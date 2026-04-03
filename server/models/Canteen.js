import mongoose from "mongoose";

const canteenSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    tags: { type: [String], default: [] },
    imageUrl: { type: String, trim: true, default: "" },
    rating: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Canteen", canteenSchema);