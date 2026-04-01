import MenuItem from "../models/menuItemModel.js";

export const toMenuItemResponse = (item) => ({
  id: item._id.toString(),
  name: item.name,
  category: item.category,
  price: item.price,
  description: item.description,
  imageUrl: item.imageUrl,
  available: item.available,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export const getMenuItems = async () => {
  const items = await MenuItem.find().sort({ createdAt: -1 });
  return items.map(toMenuItemResponse);
};

export const getAvailableMenuItems = async () => {
  const items = await MenuItem.find({ available: true }).sort({ createdAt: -1 });
  return items.map(toMenuItemResponse);
};

export const createMenuItem = async (payload) => {
  const { name, category, price, description, imageUrl, available = true } =
    payload;

  if (!name?.trim()) {
    throw new Error("Item name is required");
  }

  if (!category?.trim()) {
    throw new Error("Category is required");
  }

  if (!description?.trim()) {
    throw new Error("Description is required");
  }

  if (!imageUrl?.trim()) {
    throw new Error("Image is required");
  }

  if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    throw new Error("Valid price is required");
  }

  const item = await MenuItem.create({
    name: name.trim(),
    category: category.trim(),
    price: Number(price),
    description: description.trim(),
    imageUrl: imageUrl.trim(),
    available: Boolean(available),
  });

  return toMenuItemResponse(item);
};

export const updateMenuItem = async (id, payload) => {
  const existingItem = await MenuItem.findById(id);

  if (!existingItem) {
    throw new Error("Menu item not found");
  }

  const nextName = payload.name ?? existingItem.name;
  const nextCategory = payload.category ?? existingItem.category;
  const nextDescription = payload.description ?? existingItem.description;
  const nextImageUrl = payload.imageUrl || existingItem.imageUrl;
  const nextPrice = payload.price ?? existingItem.price;
  const nextAvailable = payload.available ?? existingItem.available;

  if (!nextName?.trim()) {
    throw new Error("Item name is required");
  }

  if (!nextCategory?.trim()) {
    throw new Error("Category is required");
  }

  if (!nextDescription?.trim()) {
    throw new Error("Description is required");
  }

  if (!nextImageUrl?.trim()) {
    throw new Error("Image is required");
  }

  if (!Number.isFinite(Number(nextPrice)) || Number(nextPrice) <= 0) {
    throw new Error("Valid price is required");
  }

  existingItem.name = nextName.trim();
  existingItem.category = nextCategory.trim();
  existingItem.description = nextDescription.trim();
  existingItem.imageUrl = nextImageUrl.trim();
  existingItem.price = Number(nextPrice);
  existingItem.available =
    typeof nextAvailable === "string"
      ? nextAvailable === "true"
      : Boolean(nextAvailable);

  await existingItem.save();

  return toMenuItemResponse(existingItem);
};

export const deleteMenuItem = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id);

  if (!item) {
    throw new Error("Menu item not found");
  }
};
