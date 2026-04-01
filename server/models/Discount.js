import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    discount_name: {
        type: String,
        required: true
    },
    discount_percentage: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }
});

export default mongoose.model("Discount", discountSchema);