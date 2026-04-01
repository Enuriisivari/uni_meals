import mongoose from "mongoose";

const deliveryTokenSchema = new mongoose.Schema({
    token_id: {
        type: String,
        required: true,
        unique: true
    },
    delivery_staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assigned_by_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assigned_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Active", "Used"],
        default: "Active"
    }
});

export default mongoose.model("DeliveryToken", deliveryTokenSchema);