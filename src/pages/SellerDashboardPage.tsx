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
                state: { error: "Access denied. Seller account required." },
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

    if (!user || user.store?.type !== "SELLER" || !store) return null;

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    <SellerStoreHeader
                        store={store}
                        productCount={stats.products}
                        onAddProduct={() => navigate("/seller/products")}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DashboardCard
                            title="Settings"
                            subtitle="Manage Store Info"
                            icon={<FiSettings />}
                            onClick={() => navigate("/seller/store")}
                            variant="purple"
                        />

                        <DashboardCard
                            title={String(stats.products)}
                            subtitle="Active Products"
                            icon={<FiPackage />}
                            onClick={() => navigate("/seller/products")}
                            variant="green"
                        />

                        <DashboardCard
                            title={String(stats.orders)}
                            subtitle="Pending Orders"
                            icon={<FiShoppingBag />}
                            onClick={() => navigate("/seller/orders")}
                            variant="blue"
                        />

                        <DashboardCard
                            title={String(stats.alerts)}
                            subtitle="Low Stock Alerts"
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

const VARIANT_STYLES: Record<CardVariant, string> = {
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
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
    return (
        <div
            onClick={onClick}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${VARIANT_STYLES[variant]}`}>
                    {icon}
                </div>
                <FiArrowRight className="text-gray-300 group-hover:text-gray-700 transition" />
            </div>
            <h3 className="text-2xl font-bold text-[#1f2933]">{title}</h3>
            <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
    );
}
