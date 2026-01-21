import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import SellerStoreHeader from "../components/seller/SellerStoreHeader";
import {
    FiPackage,
    FiShoppingBag,
    FiAlertTriangle,
    FiArrowRight,
    FiSettings,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

import {
    getStore,
    getProducts,
    getOrders,
    getStockAlerts,
    SellerStore,
} from "../services/seller.service";

import { useAuth } from "../context/AuthContext";

export default function SellerDashboardPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user } = useAuth();

    const [store, setStore] = useState<SellerStore | null>(null);
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        alerts: 0,
    });

    useEffect(() => {
        if (!user) return;

        if (user.store?.type !== "SELLER" && !user.isAdmin) {
            navigate("/profile", {
                replace: true,
                state: { error: `${t("seller.accessDenied")} ${t("seller.sellerAccountRequired")}` },
            });
            return;
        }

        async function loadDashboard() {
            try {
                // Ensure we have the full store data if context only has limited info
                const storeData = await getStore();
                if (storeData) setStore(storeData);

                const [products, orders, alerts] = await Promise.all([
                    getProducts(),
                    getOrders(),
                    getStockAlerts(),
                ]);

                // Calculate pending items count
                const pendingItemsCount = orders.orders.reduce((acc: number, order: any) => {
                    return acc + order.items.filter((item: any) => item.status === "PENDING_APPROVAL").length;
                }, 0);

                setStats({
                    products: products.length,
                    orders: pendingItemsCount,
                    alerts: alerts.length,
                });
            } catch (err) {
                console.error("Seller dashboard load failed:", err);
            }
        }

        loadDashboard();
    }, [user, navigate]);

    const isAr = i18n.language === "ar";

    if (!user || user.store?.type !== "SELLER" || !store) return null;

    return (
        <DashboardLayout>
            <div className={`w-full min-h-screen p-6 sm:p-8 lg:p-10 ${isAr ? "text-right" : "text-left"}`}>
                <div className="max-w-7xl mx-auto space-y-8">
                    <SellerStoreHeader
                        store={store}
                        productCount={stats.products}
                        onAddProduct={() => navigate("/seller/products")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <DashboardCard
                            title={t("seller.settings")}
                            subtitle={t("seller.manageStoreInfo")}
                            icon={<FiSettings />}
                            onClick={() => navigate("/seller/store")}
                            variant="purple"
                        />

                        <DashboardCard
                            title={String(stats.products)}
                            subtitle={t("seller.activeProducts")}
                            icon={<FiPackage />}
                            onClick={() => navigate("/seller/products")}
                            variant="green"
                        />

                        <DashboardCard
                            title={String(stats.orders)}
                            subtitle={t("seller.pendingOrders")}
                            icon={<FiShoppingBag />}
                            onClick={() => navigate("/seller/orders")}
                            variant="blue"
                        />

                        <DashboardCard
                            title={String(stats.alerts)}
                            subtitle={t("seller.lowStockAlerts")}
                            icon={<FiAlertTriangle />}
                            onClick={() => navigate("/seller/stock-alerts")}
                            variant="amber"
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

/* ---------- CARD COMPONENT ---------- */

type CardVariant = "purple" | "green" | "blue" | "amber";

const VARIANT_STYLES: Record<CardVariant, { bg: string, text: string, decoration: string }> = {
    purple: {
        bg: "bg-indigo-500/10",
        text: "text-indigo-400",
        decoration: "bg-indigo-500/5"
    },
    green: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        decoration: "bg-emerald-500/5"
    },
    blue: {
        bg: "bg-sky-500/10",
        text: "text-sky-400",
        decoration: "bg-sky-500/5"
    },
    amber: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        decoration: "bg-amber-500/5"
    },
};

function DashboardCard({
    title,
    subtitle,
    icon,
    onClick,
    variant,
}: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant: CardVariant;
}) {
    const { i18n } = useTranslation();
    const isAr = i18n.language === "ar";
    const style = VARIANT_STYLES[variant];

    return (
        <div
            onClick={onClick}
            className="bg-black/40 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-white/10 cursor-pointer transition-all duration-500 group relative overflow-hidden shadow-2xl hover:border-white/20 hover:bg-white/10 active:scale-95"
        >
            {/* Decorative Background Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-opacity duration-700 opacity-20 group-hover:opacity-40 ${style.decoration}`}></div>

            <div className={`flex items-center justify-between mb-6 relative z-10 ${isAr ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className={`w-12 h-12 rounded-xl border border-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110 flex items-center justify-center text-xl ${style.bg} ${style.text}`}>
                    {icon}
                </div>
                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/20 ${isAr ? "rotate-180" : ""}`}>
                    <FiArrowRight className="text-white/20 group-hover:text-white transition-colors" size={16} />
                </div>
            </div>

            <div className={`relative z-10 ${isAr ? "text-right" : "text-right" /* Keeping text-right as per original design but wrapping it for clarity */}`}>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-0.5 group-hover:text-emerald-400 transition-colors duration-500">{title}</h3>
                <p className="text-white/30 font-bold uppercase tracking-widest text-[9px]">{subtitle}</p>
            </div>
        </div>
    );
}
