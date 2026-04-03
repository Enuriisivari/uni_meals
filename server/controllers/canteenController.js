import {
  getAllCanteens,
  getCanteenById,
  createCanteen,
  updateCanteen,
  deleteCanteen,
} from "../services/canteenService.js";

export const getCanteens = async (req, res) => {
  try {
    const canteens = await getAllCanteens();
    res.json(canteens);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch canteens", error: err.message });
  }
};

export const getCanteen = async (req, res) => {
  try {
    const canteen = await getCanteenById(req.params.id);
    if (!canteen) return res.status(404).json({ message: "Canteen not found" });
    res.json(canteen);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch canteen", error: err.message });
  }
};

export const createNewCanteen = async (req, res) => {
  try {
    const canteen = await createCanteen(req.body);
    res.status(201).json(canteen);
  } catch (err) {
    res.status(500).json({ message: "Failed to create canteen", error: err.message });
  }
};

export const updateExistingCanteen = async (req, res) => {
  try {
    const updated = await updateCanteen(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Canteen not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update canteen", error: err.message });
  }
};

export const removeCanteen = async (req, res) => {
  try {
    const deleted = await deleteCanteen(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Canteen not found" });
    res.json({ message: "Canteen deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete canteen", error: err.message });
  }
};