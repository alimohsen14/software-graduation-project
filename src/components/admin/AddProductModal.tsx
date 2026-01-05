import React, { useState, useEffect, useRef } from "react";
import { FiX, FiImage, FiUpload } from "react-icons/fi";
import { CreateProductPayload } from "../../services/shopService";
import { uploadImage } from "../../services/upload.service";

interface ProductFormData {
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  badge: string;
}

interface AddProductModalProps {
  onClose: () => void;
  onSubmit: (data: CreateProductPayload) => void;
  initialData?: ProductFormData | null;
  isLoading?: boolean;
}

const defaultForm: ProductFormData = {
  name: "",
  shortDescription: "",
  fullDescription: "",
  price: 0,
  image: "",
  stock: 0,
  category: "",
  badge: "",
};

export default function AddProductModal({
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: AddProductModalProps) {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<ProductFormData>(initialData || defaultForm);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.image) {
      alert("Product image is required");
      return;
    }

    const payload: CreateProductPayload = {
      name: form.name,
      price: form.price,
      image: form.image,
      stock: form.stock,
      category: form.category,
      shortDescription: form.shortDescription || undefined,
      fullDescription: form.fullDescription || undefined,
      badge: form.badge || undefined,
    };

    onSubmit(payload);
  }

  const isBusy = isLoading || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-5 relative">
        {/* Close */}
        <button
          onClick={onClose}
          disabled={isBusy}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 disabled:opacity-50"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold text-[#1d2d1f] mb-4">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* IMAGE UPLOAD */}
          <div className="flex gap-3">
            {/* Image Preview */}
            <div className="w-16 h-16 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden flex-shrink-0">
              {isUploading ? (
                <span className="w-5 h-5 border-2 border-gray-300 border-t-[#4A6F5D] rounded-full animate-spin"></span>
              ) : form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiImage className="text-gray-400" size={20} />
              )}
            </div>
            {/* File Input */}
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1">Product Image *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isBusy}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-left flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                <FiUpload className="text-[#4A6F5D]" size={16} />
                {isUploading
                  ? "Uploading..."
                  : form.image
                    ? "Change Image"
                    : "Choose Image"}
              </button>
            </div>
          </div>

          {/* NAME + CATEGORY */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50"
                disabled={isBusy}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange as any}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#4A6F5D]/20"
                disabled={isBusy}
              >
                <option value="">Select Category</option>
                <option value="PALESTINIAN_FOOD">Palestinian Food</option>
                <option value="PALESTINIAN_LIFESTYLE">Palestinian Lifestyle</option>
                <option value="HANDMADE">Handmade</option>
                <option value="PALESTINIAN_HERITAGE">Palestinian Heritage</option>
              </select>
            </div>
          </div>

          {/* PRICE + STOCK + BADGE */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Price (₪) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50"
                disabled={isBusy}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50"
                disabled={isBusy}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Badge</label>
              <input
                name="badge"
                value={form.badge}
                onChange={handleChange}
                placeholder="NEW / HOT"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50"
                disabled={isBusy}
              />
            </div>
          </div>

          {/* DESCRIPTIONS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1">Short Description</label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Brief description"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 resize-none"
                disabled={isBusy}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Full Description</label>
              <textarea
                name="fullDescription"
                value={form.fullDescription}
                onChange={handleChange}
                rows={2}
                placeholder="Detailed description"
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 resize-none"
                disabled={isBusy}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm font-bold disabled:opacity-50"
              disabled={isBusy}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#4A6F5D] text-white text-sm font-bold hover:bg-[#3d5c4d] disabled:opacity-50 flex items-center gap-2"
              disabled={isBusy}
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : isEditMode ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
