import React, { useEffect, useState } from "react";
import * as sellerService from "../../services/seller.service";
import * as adminService from "../../services/admin.service";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle } from "react-icons/fi";

const getService = () => window.location.pathname.startsWith('/admin') ? adminService : sellerService;

export default function StockAlertsManagementView() {
    const { t, i18n } = useTranslation();
    const service = getService();
    // ...
    const [products, setProducts] = useState<sellerService.SellerProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await service.getStockAlerts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load alerts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, [service]);

    const isAr = i18n.language === "ar";

    return (
        <div className={`py-10 px-6 max-w-5xl mx-auto space-y-12 ${isAr ? "text-right" : "text-left"}`}>
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{t("seller.alerts.title")}</h1>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{t("seller.alerts.subtitle")}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="px-10 py-6 bg-amber-500/10 border-b border-amber-500/10">
                    <div className={`flex items-center gap-3 text-amber-500 uppercase tracking-widest font-black text-xs ${isAr ? "flex-row-reverse" : ""}`}>
                        <FiAlertTriangle size={18} />
                        {t("seller.alerts.priorityDepletion")}
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-black text-white/20 uppercase tracking-widest text-[10px]">{t("seller.alerts.loading")}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-emerald-500/20">
                            <FiAlertTriangle className="text-emerald-400" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white/40 uppercase tracking-tight">{t("seller.alerts.systemOptimized")}</h3>
                        <p className="mt-2 font-bold text-white/20 uppercase tracking-widest text-[10px]">{t("seller.alerts.allSafe")}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse" dir={isAr ? "rtl" : "ltr"}>
                            <thead>
                                <tr className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] bg-white/5">
                                    <th className={`px-10 py-5 ${isAr ? "text-right" : "text-left"}`}>{t("seller.alerts.consignmentDescriptor")}</th>
                                    <th className={`px-10 py-5 ${isAr ? "text-right" : "text-left"}`}>{t("seller.alerts.residualStock")}</th>
                                    <th className={`px-10 py-5 ${isAr ? "text-right" : "text-left"}`}>{t("seller.alerts.consignmentValue")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-medium">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-all group">
                                        <td className={`px-10 py-6 text-white font-black uppercase tracking-tight group-hover:text-amber-500 transition-colors ${isAr ? "text-right" : "text-left"}`}>{p.name}</td>
                                        <td className={`px-10 py-6 text-red-500 font-black tracking-widest ${isAr ? "text-right" : "text-left"}`}>
                                            <span className="px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                                                {p.stock} {t("seller.alerts.units")}
                                            </span>
                                        </td>
                                        <td className={`px-10 py-6 text-white/40 font-bold ${isAr ? "text-right" : "text-left"}`}>{p.price} ₪</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
