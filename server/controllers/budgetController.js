import Budget from "../models/Budget.js";

// Create a new budget
export const createBudget = async (req, res) => {
    try {
        const { month, allocated_amount } = req.body;

        if (!month || !allocated_amount) {
            return res.status(400).json({ message: "Month and allocated amount are required" });
        }

        const newBudget = new Budget({
            month,
            allocated_amount
        });

        const savedBudget = await newBudget.save();
        res.status(201).json({ message: "Budget created successfully", budget: savedBudget });
    } catch (error) {
        console.error("Create Budget Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Budget for this month already exists" });
        }
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get all budgets
export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find().sort({ month: -1 });
        res.status(200).json(budgets);
    } catch (error) {
        console.error("Get Budgets Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Update a budget (e.g., adding expenses)
export const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { spent_amount } = req.body;
        
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        let updateData = { ...req.body };
        
        // Auto-update status if spent_amount exceeds allocated_amount
        if (spent_amount !== undefined) {
            if (spent_amount > budget.allocated_amount) {
                updateData.status = "Exceeded";
            } else if (budget.status === "Exceeded" && spent_amount <= budget.allocated_amount) {
                updateData.status = "Active";
            }
        }

        const updatedBudget = await Budget.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: "Budget updated successfully", budget: updatedBudget });
    } catch (error) {
        console.error("Update Budget Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBudget = await Budget.findByIdAndDelete(id);

        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        console.error("Delete Budget Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
