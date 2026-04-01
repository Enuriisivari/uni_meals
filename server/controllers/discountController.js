import Discount from "../models/Discount.js";

// Create a new discount
export const createDiscount = async (req, res) => {
    try {
        const { discount_name, discount_percentage, start_date, end_date } = req.body;

        if (!discount_name || !discount_percentage || !start_date || !end_date) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newDiscount = new Discount({
            discount_name,
            discount_percentage,
            start_date,
            end_date
        });

        const savedDiscount = await newDiscount.save();
        res.status(201).json({ message: "Discount created successfully", discount: savedDiscount });
    } catch (error) {
        console.error("Create Discount Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all discounts
export const getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find().sort({ start_date: -1 });
        res.status(200).json(discounts);
    } catch (error) {
        console.error("Get Discounts Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update a discount
export const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDiscount = await Discount.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.status(200).json({ message: "Discount updated successfully", discount: updatedDiscount });
    } catch (error) {
        console.error("Update Discount Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete a discount
export const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDiscount = await Discount.findByIdAndDelete(id);

        if (!deletedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
        console.error("Delete Discount Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
