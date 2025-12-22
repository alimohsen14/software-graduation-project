import React, { useState } from "react";
import { FiX, FiImage } from "react-icons/fi";

interface AddProductModalProps {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    shortDescription?: string;
    fullDescription?: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    badge?: string;
  }) => void;
}

export default function AddProductModal({
  onClose,
  onSubmit,
}: AddProductModalProps) {
  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    price: 0,
    image: "",
    stock: 0,
    category: "",
    badge: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || form.price <= 0 || !form.category || !form.image) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <FiX size={22} />
        </button>

        <h2 className="text-2xl font-extrabold text-[#1d2d1f] mb-6">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* IMAGE */}
          <div>
            <label className="block text-sm font-bold mb-1">Image URL *</label>
            <div className="flex gap-4">
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 border rounded-xl bg-gray-50"
              />
              <div className="w-24 h-24 rounded-xl bg-gray-100 border flex items-center justify-center overflow-hidden">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage className="text-gray-400" size={28} />
                )}
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">
                Product Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Category *</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            </div>
          </div>

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">
                Price (₪) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            </div>
          </div>

          {/* DESCRIPTIONS */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Short Description
            </label>
            <textarea
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              rows={2}
              placeholder="Short description shown in cards"
              className="w-full px-4 py-3 border rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Full Description
            </label>
            <textarea
              name="fullDescription"
              value={form.fullDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Detailed product description"
              className="w-full px-4 py-3 border rounded-xl bg-gray-50"
            />
          </div>

          {/* BADGE */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Badge (optional)
            </label>
            <input
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="NEW / HOT / LIMITED"
              className="w-full px-4 py-3 border rounded-xl bg-gray-50"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-[#74a52d] text-white font-bold hover:bg-[#85bd33]"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
