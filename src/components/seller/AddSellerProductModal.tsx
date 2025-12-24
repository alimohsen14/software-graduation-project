import React, { useState } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import { createProduct, CreateProductPayload } from "../../services/seller.service";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function AddSellerProductModal({ onClose, onSuccess }: Props) {
    const [formData, setFormData] = useState<CreateProductPayload>({
        name: "",
        shortDescription: "",
        description: "",
        price: 0,
        image: "",
        stock: 0,
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" || name === "stock" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.price || !formData.image.trim()) {
            setError("Please fill in all required fields");
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            setError("Please log in to add products");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createProduct(token, formData);
            onSuccess();
        } catch (err: any) {
            console.error("Failed to create product", err);
            setError(err.response?.data?.message || "Failed to create product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                        />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <input
                            type="text"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                        />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock || ""}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-[#4A6F5D] text-white rounded-lg font-bold hover:bg-[#3d5c4d] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin" size={18} />
                                Creating...
                            </>
                        ) : (
                            "Create Product"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
