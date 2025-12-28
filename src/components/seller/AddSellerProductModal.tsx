import React, { useState, useEffect, useRef } from "react";
import { FiX, FiLoader, FiUpload, FiImage } from "react-icons/fi";
import { createProduct, updateProduct, CreateProductPayload, SellerProduct } from "../../services/seller.service";
import { uploadImage } from "../../services/upload.service";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: SellerProduct | null;
};

export default function AddSellerProductModal({ onClose, onSuccess, initialData }: Props) {
    const [formData, setFormData] = useState<CreateProductPayload>({
        name: "",
        shortDescription: "",
        description: "",
        price: 0,
        image: "",
        stock: 0,
        category: "",
        badge: "",
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                shortDescription: initialData.shortDescription || "",
                description: initialData.description || "",
                price: initialData.price,
                image: initialData.image,
                stock: initialData.stock,
                category: initialData.category || "",
                badge: initialData.badge || "",
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" || name === "stock" ? Number(value) : value,
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        try {
            const url = await uploadImage(file);
            setFormData((prev) => ({ ...prev, image: url }));
        } catch (err) {
            console.error("Upload failed", err);
            setError("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.price || !formData.image.trim()) {
            setError("Please fill in all required fields");
            return;
        }

        if (!localStorage.getItem("accessToken")) {
            setError("Please log in to manage products");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (initialData) {
                await updateProduct(initialData.id, formData);
            } else {
                await createProduct(formData);
            }
            onSuccess();
        } catch (err: any) {
            console.error("Failed to save product", err);
            setError(err.response?.data?.message || "Failed to save product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-gray-900">
                        {initialData ? "Edit Product" : "Add New Product"}
                    </h2>
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

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FiImage className="text-gray-300" size={24} />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <FiLoader className="animate-spin" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload /> Upload Image
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-gray-400 mt-2">
                                    Recommended: Square image, max 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

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

                    {/* Category and Badge */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Soaps"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Badge
                            </label>
                            <select
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#4A6F5D]/20 focus:border-[#4A6F5D] transition"
                            >
                                <option value="">None</option>
                                <option value="NEW">New</option>
                                <option value="HOT">Hot</option>
                                <option value="SALE">Sale</option>
                            </select>
                        </div>
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
                        disabled={loading || uploading}
                        className="w-full px-4 py-3 bg-[#4A6F5D] text-white rounded-lg font-bold hover:bg-[#3d5c4d] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin" size={18} />
                                {initialData ? "Saving..." : "Creating..."}
                            </>
                        ) : (
                            initialData ? "Save Changes" : "Create Product"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
