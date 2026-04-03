import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        menuItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
            trim: true,
        },
        deliveryLocation: {
            type: String,
            required: true,
            trim: true,
        },
        notes: {
            type: String,
            default: "",
            trim: true,
        },
        status: {
            type: String,
            required: true,
            default: "pending",
            enum: ["pending", "preparing", "ready", "completed", "cancelled"],
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator: (items) => Array.isArray(items) && items.length > 0,
                message: "At least one order item is required",
            },
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        orderTime: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);