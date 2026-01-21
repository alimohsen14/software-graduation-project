import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { applyToBeSeller, SellerApplication } from "../services/seller.service";
import { FiShoppingBag, FiCheckCircle, FiLoader } from "react-icons/fi";

export default function BecomeSellerPage() {
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
            setError("Please fill in all required fields (Store Name, Product Type, Region)");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await applyToBeSeller(formData);
            setSuccess(true);
        } catch (err: any) {
            console.error("Failed to submit application", err);
            setError(err.response?.data?.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center p-6 animate-in zoom-in duration-500">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl md:rounded-3xl p-8 md:p-12 max-w-md w-full text-center border border-emerald-500/20 shadow-2xl">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                            <FiCheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">
                            تم إرسال الطلب!
                        </h2>
                        <p className="text-white/40 text-sm font-medium mb-8 leading-relaxed">
                            تم تقديم طلب الانضمام كبائع بنجاح. سنقوم بمراجعة طلبك والتواصل معك قريباً.
                        </p>
                        <button
                            onClick={() => navigate("/marketplace")}
                            className="w-full h-14 bg-emerald-600/20 text-emerald-400 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] border border-emerald-500/20 hover:bg-emerald-600/30 transition active:scale-95"
                        >
                            العودة للمتجر
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-700">
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl max-w-2xl w-full">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                            <FiShoppingBag className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">انضم كبائع</h1>
                            <p className="text-white/40 text-sm font-medium">ابدأ البيع في متجر Palestine3D</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-8 text-xs font-black uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Store Name */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">
                                اسم المتجر <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                placeholder="أدخل اسم متجرك"
                                dir="rtl"
                                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none"
                            />
                        </div>

                        {/* Product Type */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">
                                نوع المنتجات <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="productType"
                                value={formData.productType}
                                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                                dir="rtl"
                                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none appearance-none"
                            >
                                <option value="" className="bg-zinc-900">اختر الفئة</option>
                                <option value="Palestinian Food" className="bg-zinc-900">طعام فلسطيني</option>
                                <option value="Palestinian Lifestyle" className="bg-zinc-900">نمط حياة فلسطيني</option>
                                <option value="Handmade" className="bg-zinc-900">أشغال يدوية</option>
                                <option value="Palestinian Heritage" className="bg-zinc-900">تراث فلسطيني</option>
                            </select>
                        </div>

                        {/* Region */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">
                                المنطقة / المدينة <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="مثال: رام الله، نابلس، غزة"
                                dir="rtl"
                                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">
                                رسالة اختيارية / وصف العمل
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="أخبرنا المزيد عن عملك..."
                                rows={3}
                                dir="rtl"
                                className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition outline-none resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-emerald-600/20 text-emerald-400 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-emerald-500/20 hover:bg-emerald-600/30 transition disabled:opacity-50 shadow-2xl active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin" size={18} />
                                    جاري الإرسال...
                                </>
                            ) : (
                                "إرسال الطلب"
                            )}
                        </button>
                    </form>

                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center mt-8">
                        بإرسالك الطلب، أنت توافق على شروط وأحكام البيع الخاصة بنا.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
