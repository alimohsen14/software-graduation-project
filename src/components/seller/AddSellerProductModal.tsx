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
    const { t, i18n } = useTranslation("seller");
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
            setError(t("products.uploadFailed"));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.image.trim()) {
            setError(t("products.imageRequired"));
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
            setError(err.response?.data?.message || t("products.saveFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-zinc-950/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className={`px-8 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">
                            {initialData ? t("products.editProduct") : t("products.addNew")}
                        </h2>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-1">{t("products.specsSubtitle")}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar relative z-10">
                    {error && (
                        <div className={`bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>
                            {error}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">
                            {t("products.productImage")} <span className="text-emerald-500/50 ml-1">*</span>
                        </label>
                        <div className={`flex items-start gap-5 ${isAr ? 'flex-row-reverse' : ''}`}>
                            <div className="w-20 h-20 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 transition-all hover:border-emerald-500/30 group">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <FiImage className="text-white/10 group-hover:text-emerald-500/20" size={24} />
                                )}
                            </div>
                            <div className={`flex-1 ${isAr ? 'text-right' : 'text-left'}`}>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-white/5 text-white/50 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
                                >
                                    {uploading ? <><FiLoader className="animate-spin" /> {t("products.uploading")}</> : <><FiUpload /> {t("products.chooseImage")}</>}
                                </button>
                                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-2">{t("products.imageHint")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{t("products.productName")} *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                dir={isAr ? "rtl" : "ltr"}
                                placeholder={t("products.namePlaceholder")}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{t("products.shortDesc")}</label>
                            <input
                                type="text"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                dir={isAr ? "rtl" : "ltr"}
                                placeholder={t("products.shortDescPlaceholder")}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{t("products.priceLabel")} *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price || ""}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all text-base tracking-tight"
                            />
                        </div>
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{t("products.availableQty")}</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock || ""}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all text-base tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{t("products.category")} *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                dir={isAr ? "rtl" : "ltr"}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all appearance-none text-sm"
                            >
                                <option value="" className="bg-zinc-900">{t("products.chooseCategory")}</option>
                                <option value="PALESTINIAN_FOOD" className="bg-zinc-900">{isAr ? "مأكولات فلسطينية" : "Palestinian Food"}</option>
                                <option value="PALESTINIAN_LIFESTYLE" className="bg-zinc-900">{isAr ? "نمط حياة" : "Lifestyle"}</option>
                                <option value="HANDMADE" className="bg-zinc-900">{isAr ? "صناعة يدوية" : "Handmade"}</option>
                                <option value="PALESTINIAN_HERITAGE" className="bg-zinc-900">{isAr ? "تراث فلسطيني" : "Heritage"}</option>
                            </select>
                        </div>
                        <div className={isAr ? 'text-right' : 'text-left'}>
                            <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{t("products.badgeLabel")}</label>
                            <select
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                dir={isAr ? "rtl" : "ltr"}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 font-bold focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all appearance-none text-sm"
                            >
                                <option value="" className="bg-zinc-900">{t("products.none")}</option>
                                <option value="NEW" className="bg-zinc-900">{t("products.new")}</option>
                                <option value="HOT" className="bg-zinc-900">{t("products.hot")}</option>
                                <option value="SALE" className="bg-zinc-900">{t("products.sale")}</option>
                            </select>
                        </div>
                    </div>

                    <div className={isAr ? 'text-right' : 'text-left'}>
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{t("products.detailedDesc")}</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            dir={isAr ? "rtl" : "ltr"}
                            placeholder={t("products.descPlaceholder")}
                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white/50 font-medium placeholder:text-white/10 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all resize-none text-sm leading-relaxed"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full py-4 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 text-sm"
                    >
                        {loading ? <><FiLoader className="animate-spin" /> {t("products.saving")}</> : initialData ? t("products.updateProduct") : t("products.addToStore")}
                    </button>
                </form>
            </div>
        </div>
    );
}
