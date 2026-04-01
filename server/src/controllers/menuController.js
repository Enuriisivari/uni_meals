import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  updateMenuItem,
} from "../services/menuService.js";

export const listMenuItems = async (req, res) => {
  try {
    const items = await getMenuItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/menu-items/${req.file.filename}`
      : "";

    const item = await createMenuItem({
      ...req.body,
      imageUrl,
    });
    res.status(201).json({
      message: "Menu item created successfully",
      item,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const editMenuItem = async (req, res) => {
  try {
    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/menu-items/${req.file.filename}`
      : undefined;

    const item = await updateMenuItem(req.params.id, {
      ...req.body,
      imageUrl,
    });

    res.json({
      message: "Menu item updated successfully",
      item,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeMenuItem = async (req, res) => {
  try {
    await deleteMenuItem(req.params.id);
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
