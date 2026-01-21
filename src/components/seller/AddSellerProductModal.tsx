import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
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
            setError(t("seller.products.uploadFailed"));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Relaxed validation: Allow partial updates. 
        // Backend should handle required fields for creation.
        if (!formData.image.trim()) {
            setError(t("seller.products.imageRequired"));
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
            setError(err.response?.data?.message || t("seller.products.saveFailed"));
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
                <div className={`px-6 md:px-10 py-6 md:py-8 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-1 ${isAr ? 'text-right' : 'text-left'}`}>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                            {initialData ? t("seller.products.editProduct") : t("seller.products.addNew")}
                        </h2>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">{t("seller.products.specsSubtitle")}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar relative z-10">
                    {error && (
                        <div className={`bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-4 duration-300 ${isAr ? 'text-right' : 'text-left'}`}>
                            {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-4">
                            {t("seller.products.productImage")} <span className="text-emerald-500/50 ml-1">*</span>
                        </label>
                        <div className={`flex flex-col items-center sm:items-start gap-6 ${isAr ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                            <div className="w-28 h-28 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner group transition-all hover:border-emerald-500/30">
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <FiImage className="text-white/10 group-hover:text-emerald-500/30 transition-colors" size={28} />
                                )}
                            </div>
                            <div className={`flex-1 w-full text-center ${isAr ? 'sm:text-right' : 'sm:text-left'}`}>
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
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-white/5 text-white/50 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-30"
                                >
                                    {uploading ? (
                                        <>
                                            <FiLoader className="animate-spin" /> {t("seller.products.uploading")}
                                        </>
                                    ) : (
                                        <>
                                            <FiUpload /> {t("seller.products.chooseImage")}
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-3">
                                    {t("seller.products.imageHint")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                            {t("seller.products.productName")} <span className="text-emerald-500/50 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            dir={isAr ? "rtl" : "ltr"}
                            placeholder={t("seller.products.namePlaceholder")}
                            className="w-full px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-sm"
                        />
                    </div>

                    {/* Short Description */}
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                            {t("seller.products.shortDesc")}
                        </label>
                        <input
                            type="text"
                            name="shortDescription"
                            value={formData.shortDescription}
                            onChange={handleChange}
                            dir={isAr ? "rtl" : "ltr"}
                            placeholder={t("seller.products.shortDescPlaceholder")}
                            className="w-full px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white/60 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-sm"
                        />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                                {t("seller.products.priceLabel")} <span className="text-emerald-500/50 ml-1">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price || ""}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-base md:text-lg tracking-tight"
                            />
                        </div>
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                                {t("seller.products.availableQty")}
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock || ""}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner text-base md:text-lg tracking-tight"
                            />
                        </div>
                    </div>

                    {/* Category and Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                                {t("seller.products.category")} <span className="text-emerald-500/50 ml-1">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                dir={isAr ? "rtl" : "ltr"}
                                className="w-full px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white/70 font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner appearance-none custom-select text-sm"
                            >
                                <option value="" className="bg-zinc-900">{t("seller.products.chooseCategory")}</option>
                                <option value="PALESTINIAN_FOOD" className="bg-zinc-900">{isAr ? "مأكولات فلسطينية" : "Palestinian Food"}</option>
                                <option value="PALESTINIAN_LIFESTYLE" className="bg-zinc-900">{isAr ? "نمط حياة" : "Lifestyle"}</option>
                                <option value="HANDMADE" className="bg-zinc-900">{isAr ? "صناعة يدوية" : "Handmade"}</option>
                                <option value="PALESTINIAN_HERITAGE" className="bg-zinc-900">{isAr ? "تراث فلسطيني" : "Heritage"}</option>
                            </select>
                        </div>
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                                {t("seller.products.badgeLabel")}
                            </label>
                            <select
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                dir={isAr ? "rtl" : "ltr"}
                                className="w-full px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white/70 font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all shadow-inner appearance-none custom-select text-sm"
                            >
                                <option value="" className="bg-zinc-900">{t("seller.products.none")}</option>
                                <option value="NEW" className="bg-zinc-900">{t("seller.products.new")}</option>
                                <option value="HOT" className="bg-zinc-900">{t("seller.products.hot")}</option>
                                <option value="SALE" className="bg-zinc-900">{t("seller.products.sale")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                            {t("seller.products.detailedDesc")}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            dir={isAr ? "rtl" : "ltr"}
                            placeholder={t("seller.products.descPlaceholder")}
                            className="w-full px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-2xl text-white/50 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all resize-none shadow-inner leading-relaxed text-sm"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full px-8 py-4 md:py-5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600/30 hover:shadow-emerald-500/10 transition-all shadow-xl active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 text-xs md:text-sm"
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin" size={18} />
                                {t("seller.products.saving")}
                            </>
                        ) : (
                            <>
                                {initialData ? t("seller.products.updateProduct") : t("seller.products.addToStore")}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
