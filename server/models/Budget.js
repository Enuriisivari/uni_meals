import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        month: {
            type: String,
            required: true,
            unique: true // Format: "YYYY-MM"
        },
        allocated_amount: {
            type: Number,
            required: true
        },
        spent_amount: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["Active", "Exceeded", "Closed"],
            default: "Active"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
