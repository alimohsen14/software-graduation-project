import React from 'react';
import { FiX, FiUser, FiPhone, FiMapPin, FiCalendar, FiHome } from 'react-icons/fi';
import { SellerOrder } from '../../services/seller.service';
import { useTranslation } from "react-i18next";

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: SellerOrder | null;
}

export default function OrderDetailsModal({
    isOpen,
    onClose,
    order
}: OrderDetailsModalProps) {
    const { t, i18n } = useTranslation("seller");
    const isAr = i18n.language === "ar";

    if (!isOpen || !order) return null;

    // Delivery Source of Truth: Order fields (Strictly from backend)
    // Data Mapping: Robust Fallback Strategy
    // 1. Order Delivery Details (Primary Source)
    // 2. Nested Order Object (Potential Backend Structure)
    // 3. Customer Profile (Fallback for old orders)
    const displayPhone = order.phone || (order as any).order?.phone || order.customer?.phone || t("orderDetails.na");
    const displayCity = order.city || (order as any).order?.city || order.customer?.city || t("orderDetails.na");
    const displayAddress = order.address || (order as any).order?.address || order.customer?.address || t("orderDetails.na");

    const currentLang = i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'fr' ? 'fr-FR' : 'en-US';
    const formattedDate = new Date(order.createdAt).toLocaleDateString(currentLang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`bg-zinc-950/40 backdrop-blur-2xl rounded-[3rem] border border-white/10 w-full max-w-md shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col relative text-white ${isAr ? "text-right" : "text-left"}`}>
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header */}
                <div className={`px-10 py-8 bg-white/5 border-b border-white/5 flex items-center justify-between z-10 shrink-0 ${isAr ? "flex-row-reverse" : ""}`}>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">{t("orderDetails.title")}</h3>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">{t("orderDetails.subtitle")}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-8 relative z-10 overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        {/* Name */}
                        <div className={`flex items-start gap-4 group ${isAr ? "flex-row-reverse" : ""}`}>
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                <FiUser size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">{t("orderDetails.entityIdentifier")}</p>
                                <p className="text-sm font-black uppercase tracking-tight leading-none pt-1">
                                    {order.customer?.name || t("orderDetails.anonymous")}
                                </p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className={`flex items-start gap-4 group ${isAr ? "flex-row-reverse" : ""}`}>
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-400 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                <FiPhone size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">{t("orderDetails.commProtocol")}</p>
                                <p className="text-sm font-black uppercase tracking-tight leading-none pt-1">{displayPhone}</p>
                            </div>
                        </div>

                        {/* City */}
                        <div className={`flex items-start gap-4 group ${isAr ? "flex-row-reverse" : ""}`}>
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20 text-amber-400 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                <FiMapPin size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">{t("orderDetails.geographicalSector")}</p>
                                <p className="text-sm font-black uppercase tracking-tight leading-none pt-1">{displayCity}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className={`flex items-start gap-4 group ${isAr ? "flex-row-reverse" : ""}`}>
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 text-white/20 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                <FiHome size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">{t("orderDetails.terminalAddress")}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/60 leading-relaxed pt-1">{displayAddress}</p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="pt-8 border-t border-white/5">
                            <div className={`flex items-start gap-4 group ${isAr ? "flex-row-reverse" : ""}`}>
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 text-white/20 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                    <FiCalendar size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">{t("orderDetails.temporalTimestamp")}</p>
                                    <p className="text-sm font-black uppercase tracking-tight text-white/80 pt-1">{formattedDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-white/5 text-white/60 border border-white/10 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-[0.98] text-[10px]"
                    >
                        {t("orderDetails.deinitialize")}
                    </button>
                </div>
            </div>
        </div>
    );
}
