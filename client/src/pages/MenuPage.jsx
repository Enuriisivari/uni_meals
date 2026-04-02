import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  LoaderCircle,
  Upload,
} from "lucide-react";

const emptyFormState = {
  name: "",
  price: "",
  category: "Snacks",
  description: "",
  available: true,
  imageFile: null,
  imagePreview: "",
};

export function MenuPage({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  isSavingNewItem,
  isDeletingItem,
  saveError,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});
  const categories = ["Breakfast", "Lunch", "Snacks", "Beverages", "Desserts"];

  useEffect(() => {
    return () => {
      if (formData.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, [formData.imagePreview]);

  const handleOpenModal = (item) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        available: item.available,
        imageFile: null,
        imagePreview: item.imageUrl,
      });
    } else {
      setEditingItem(null);
      setFormData(emptyFormState);
    }

    setErrors({});
    setIsModalOpen(true);
  };

  const resetForm = () => {
    if (formData.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(formData.imagePreview);
    }

    setEditingItem(null);
    setFormData(emptyFormState);
    setErrors({});
  };

  const handleCloseModal = () => {
    if (isSavingNewItem) {
      return;
    }

    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!editingItem && !formData.imageFile) {
      newErrors.imageFile = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (formData.imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(formData.imagePreview);
    }

    setFormData((current) => ({
      ...current,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));

    setErrors((current) => ({ ...current, imageFile: undefined }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("price", String(formData.price));
    payload.append("category", formData.category);
    payload.append("description", formData.description.trim());
    payload.append("available", String(formData.available));

    if (formData.imageFile) {
      payload.append("image", formData.imageFile);
    }

    if (editingItem) {
      const updated = await onUpdateMenuItem(editingItem.id, payload);

      if (updated) {
        handleCloseModal();
      }
      return;
    }

    const created = await onAddMenuItem(payload);

    if (created) {
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await onDeleteMenuItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#0d1b52]">Manage Menu Items</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-[#f58220] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#e46f0a]"
        >
          <Plus className="h-4 w-4" /> Add New Item
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#dfe5f2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#dfe5f2] bg-[#f8faff] text-xs uppercase tracking-wider text-[#7d87a3]">
                <th className="px-6 py-4 font-medium">Item</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {menuItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-[#6b7692]"
                  >
                    No menu items found. Add your first item to populate the
                    canteen menu.
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-[#f8faff]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg border border-[#dfe5f2] object-cover"
                        />
                        <div>
                          <div className="font-medium text-[#0d1b52]">{item.name}</div>
                          <div className="max-w-[200px] truncate text-xs text-[#6b7692]">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#5f6983]">
                      <span className="rounded-md bg-[#eef2fa] px-2.5 py-1 text-xs font-medium text-[#243356]">
                        {item.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#0d1b52]">
                      Rs. {item.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="rounded-lg p-2 text-[#0d1b52] transition-colors hover:bg-[#e8eeff]"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeletingItem}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#dfe5f2] bg-[#f8faff] px-6 py-4">
              <h3 className="text-lg font-semibold text-[#0d1b52]">
                {editingItem ? "Edit Menu Item" : "Add New Item"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-[#7d87a3] transition-colors hover:text-[#243356]"
                disabled={isSavingNewItem}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#243356]">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({ ...formData, name: event.target.value })
                  }
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f58220] ${errors.name ? "border-red-500" : "border-[#d3dced]"}`}
                  placeholder="e.g. Masala Dosa"
                />
                {errors.name ? (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#243356]">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        price: event.target.value,
                      })
                    }
                    className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f58220] ${errors.price ? "border-red-500" : "border-[#d3dced]"}`}
                    placeholder="0.00"
                  />
                  {errors.price ? (
                    <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                  ) : null}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#243356]">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        category: event.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#d3dced] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f58220]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#243356]">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    })
                  }
                  rows={3}
                  className={`w-full resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f58220] ${errors.description ? "border-red-500" : "border-[#d3dced]"}`}
                  placeholder="Short description of the item..."
                />
                {errors.description ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#243356]">
                  Item Image
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-[#d3dced] bg-[#f8faff] px-4 py-5 text-sm font-medium text-[#5f6983] transition hover:border-[#f58220] hover:bg-[#fff1e2] hover:text-[#0d1b52]">
                  <Upload className="h-4 w-4" />
                  <span>{formData.imageFile?.name || "Choose image file"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {errors.imageFile ? (
                  <p className="mt-1 text-xs text-red-500">{errors.imageFile}</p>
                ) : null}
                {formData.imagePreview ? (
                  <div className="mt-3 h-40 w-full overflow-hidden rounded-lg border border-[#dfe5f2] bg-[#f8faff]">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-3 flex h-40 w-full items-center justify-center rounded-lg border border-[#dfe5f2] bg-[#f8faff] text-sm text-[#7d87a3]">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Image preview appears here
                  </div>
                )}
              </div>

              {saveError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {saveError}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#dfe5f2] bg-[#f8faff] px-6 py-4">
              <button
                onClick={handleCloseModal}
                className="rounded-lg border border-[#d3dced] bg-white px-4 py-2 text-sm font-medium text-[#243356] transition-colors hover:bg-[#f8faff]"
                disabled={isSavingNewItem}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSavingNewItem}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0d1b52] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#18388f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingNewItem ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Item"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
