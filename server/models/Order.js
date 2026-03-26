import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    canteenId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if linking to specific canteen staff/admin
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending"
    },
    paymentMethod: { type: String, default: "Cash" },
    deliveryAddress: { type: String, default: "Pickup" },
    deliveryTokenId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryToken" }, // assigned to delivery personnel
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
