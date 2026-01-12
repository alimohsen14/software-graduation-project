import React, { useState, useEffect, useRef } from "react";
import { FiX, FiLoader, FiUpload, FiImage } from "react-icons/fi";
import { CreateProductPayload, SellerProduct } from "../../services/seller.service";
import { uploadImage } from "../../services/upload.service";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: SellerProduct | null;
    createProductFn: (data: any) => Promise<any>;
    updateProductFn: (id: number, data: any) => Promise<any>;
};

export default function AddSellerProductModal({ onClose, onSuccess, initialData, createProductFn, updateProductFn }: Props) {
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

        // Relaxed validation: Allow partial updates. 
        // Backend should handle required fields for creation.
        if (!formData.image.trim()) {
            setError("Product image is required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (initialData) {
                await updateProductFn(initialData.id, formData);
            } else {
                await createProductFn(formData);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-950/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-black/50 relative">
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                            {initialData ? "Refine Product" : "Archive New SKU"}
                        </h2>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Specify consortium inventory parameters</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest animate-in slide-in-from-top-4 duration-300">
                            {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">
                            Consignment Visualization <span className="text-emerald-500/50 ml-1">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-start gap-8">
                            <div className="w-32 h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center overflow-hidden shrink-0 shadow-inner group transition-all hover:border-emerald-500/30">
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <FiImage className="text-white/10 group-hover:text-emerald-500/30 transition-colors" size={32} />
                                )}
                            </div>
                            <div className="flex-1 w-full">
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
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-white/5 text-white/50 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-30"
                                >
                                    {uploading ? (
                                        <>
                                            <FiLoader className="animate-spin" /> Transmitting...
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload /> Interface Asset
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-4">
                                    Square aspect ratio.<br />Maximum threshold: 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                            Inventory Title <span className="text-emerald-500/50 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter consensus title..."
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner"
                        />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                            Brief Metadata
                        </label>
                        <input
                            type="text"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            placeholder="Primary characteristics summary..."
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner"
                        />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                                Unit Valuation <span className="text-emerald-500/50 ml-1">*</span> (₪)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price || ""}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-lg tracking-tighter"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                                Residual Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock || ""}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-lg tracking-tighter"
                            />
                        </div>
                    </div>

                    {/* Category and Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                                Consortium Type <span className="text-emerald-500/50 ml-1">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/70 font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner appearance-none custom-select"
                            >
                                <option value="" className="bg-zinc-900">Select Category</option>
                                <option value="PALESTINIAN_FOOD" className="bg-zinc-900">Palestinian Food</option>
                                <option value="PALESTINIAN_LIFESTYLE" className="bg-zinc-900">Lifestyle Objects</option>
                                <option value="HANDMADE" className="bg-zinc-900">Handcrafted Artisanal</option>
                                <option value="PALESTINIAN_HERITAGE" className="bg-zinc-900">Heritage Preservation</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                                Highlighting Protocol
                            </label>
                            <select
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/70 font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner appearance-none custom-select"
                            >
                                <option value="" className="bg-zinc-900">None</option>
                                <option value="NEW" className="bg-zinc-900">NEW_DEPLOYMENT</option>
                                <option value="HOT" className="bg-zinc-900">PRIORITY_ITEM</option>
                                <option value="SALE" className="bg-zinc-900">LIQUIDATION_PROTOCOL</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">
                            Comprehensive Narrative
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Articulate the consensus story behind this SKU..."
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] text-white/50 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all resize-none shadow-inner leading-relaxed"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full px-8 py-5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-emerald-600/30 hover:shadow-emerald-500/10 transition-all shadow-xl active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 text-xs"
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin" size={20} />
                                {initialData ? "Synchronizing Matrix..." : "Initializing Consensus..."}
                            </>
                        ) : (
                            <>
                                {initialData ? "Apply Refined Parameters" : "Deploy Inventory Unit"}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
