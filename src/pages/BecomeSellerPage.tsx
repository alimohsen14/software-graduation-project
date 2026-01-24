import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { applyToBeSeller, SellerApplication } from "../services/seller.service";
import { FiShoppingBag, FiCheckCircle, FiLoader, FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function BecomeSellerPage() {
    const { t, i18n } = useTranslation("marketplace");
    const isRtl = i18n.language === "ar";
    const navigate = useNavigate();
    const [formData, setFormData] = useState<SellerApplication>({
        storeName: "",
        productType: "",
        region: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.storeName.trim() || !formData.productType.trim() || !formData.region.trim()) {
            setError(t("checkout.errorRequired"));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await applyToBeSeller(formData);
            setSuccess(true);
        } catch (err: any) {
            console.error("Failed to submit application", err);
            setError(err.response?.data?.message || t("checkout.paymentFailed"));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center p-6 animate-in zoom-in duration-500">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-emerald-500/20 shadow-2xl relative">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                            <FiCheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                            {t("storeForm.title")}!
                        </h2>
                        <p className="text-white/40 text-[13px] font-medium mb-8 leading-relaxed">
                            {t("status")}
                        </p>
                        <button
                            onClick={() => navigate("/marketplace")}
                            className="w-full h-11 bg-emerald-600/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20 hover:bg-emerald-600/30 transition active:scale-95"
                        >
                            {t("product.backToMarket")}
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen flex items-center justify-center p-4 py-16 animate-in fade-in duration-700">
                <div className="bg-black/60 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 border border-white/10 shadow-2xl max-w-[520px] w-full max-h-[90vh] overflow-y-auto relative custom-scrollbar">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-20`}
                        title={t("storeForm.back")}
                    >
                        <FiArrowLeft className={isRtl ? "rotate-180" : ""} size={16} />
                    </button>

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mt-6 mb-8">
                        <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-4">
                            <FiShoppingBag className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h1 className="text-xl font-black text-white uppercase tracking-tight mb-1">{t("storeForm.title")}</h1>
                        <p className="text-white/30 text-[11px] font-medium max-w-[280px] leading-relaxed lowercase">{t("storeForm.subtitle")}</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Store Name */}
                        <div className="space-y-1.5">
                            <label className={`block text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ${isRtl ? 'text-right' : 'text-left'}`}>
                                {t("storeForm.storeNameLabel")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                placeholder={t("storeForm.storeNamePlaceholder")}
                                dir={isRtl ? "rtl" : "ltr"}
                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none"
                            />
                        </div>

                        {/* Product Type */}
                        <div className="space-y-1.5">
                            <label className={`block text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ${isRtl ? 'text-right' : 'text-left'}`}>
                                {t("storeForm.categoryLabel")} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                                    dir={isRtl ? "rtl" : "ltr"}
                                    className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-zinc-900">{t("storeForm.categoryPlaceholder")}</option>
                                    <option value="Palestinian Food" className="bg-zinc-900">{t("categories.food")}</option>
                                    <option value="Palestinian Lifestyle" className="bg-zinc-900">{t("categories.lifestyle")}</option>
                                    <option value="Handmade" className="bg-zinc-900">{t("categories.handmade")}</option>
                                    <option value="Palestinian Heritage" className="bg-zinc-900">{t("categories.heritage")}</option>
                                </select>
                                <div className={`absolute inset-y-0 ${isRtl ? 'left-4' : 'right-4'} flex items-center pointer-events-none opacity-20`}>
                                    <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Region */}
                        <div className="space-y-1.5">
                            <label className={`block text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ${isRtl ? 'text-right' : 'text-left'}`}>
                                {t("storeForm.locationLabel")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder={t("storeForm.locationPlaceholder")}
                                dir={isRtl ? "rtl" : "ltr"}
                                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className={`block text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ${isRtl ? 'text-right' : 'text-left'}`}>
                                {t("storeForm.descriptionLabel")}
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder={t("storeForm.descriptionPlaceholder")}
                                rows={3}
                                dir={isRtl ? "rtl" : "ltr"}
                                className="w-full min-h-[90px] px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-500 transition disabled:opacity-50 shadow-xl active:scale-[0.98]"
                            >
                                {loading ? (
                                    <FiLoader className="animate-spin" size={16} />
                                ) : (
                                    t("storeForm.submit")
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-[8px] font-black uppercase tracking-widest text-white/10 text-center mt-6 leading-tight">
                        By submitting, you agree to our heritage seller guidelines.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
